'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { getPostById, createPost, updatePost } from '@/lib/db';
import { createSlug, calcReadTime } from '@/lib/utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Save, Eye, Sparkles, Upload, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Post, PostCategory } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const TOOLBAR = [
  { cmd: 'bold', label: 'B' },
  { cmd: 'italic', label: 'I' },
  { cmd: 'heading', label: 'H2', opts: { level: 2 } },
  { cmd: 'heading', label: 'H3', opts: { level: 3 } },
  { cmd: 'bulletList', label: '• List' },
  { cmd: 'orderedList', label: '1. List' },
  { cmd: 'blockquote', label: '"' },
  { cmd: 'horizontalRule', label: '—' },
];

export default function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!postId;

  const [form, setForm] = useState({
    title: '', title_kh: '', slug: '', category: 'ai-frontier-brief' as PostCategory,
    excerpt: '', excerpt_kh: '', coverImage: '',
    featured: false, published: false, readTime: '5 min read', tags: '',
    theSignal: '', cambodiaLens: '', oneThingToTry: '',
    theSignal_kh: '', cambodiaLens_kh: '', oneThingToTry_kh: '',
  });
  const [bodyKh, setBodyKh] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your article here...' }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setForm(f => ({ ...f, readTime: calcReadTime(text) }));
    },
  });

  useEffect(() => {
    if (isEdit && postId) {
      getPostById(postId).then(post => {
        if (!post) return;
        setForm({
          title: post.title || '',
          title_kh: post.title_kh || '',
          slug: post.slug || '',
          category: post.category || 'ai-frontier-brief',
          excerpt: post.excerpt || '',
          excerpt_kh: post.excerpt_kh || '',
          coverImage: post.coverImage || '',
          featured: post.featured || false,
          published: post.published || false,
          readTime: post.readTime || '5 min read',
          tags: (post.tags || []).join(', '),
          theSignal: post.theSignal || '',
          cambodiaLens: post.cambodiaLens || '',
          oneThingToTry: post.oneThingToTry || '',
          theSignal_kh: post.theSignal_kh || '',
          cambodiaLens_kh: post.cambodiaLens_kh || '',
          oneThingToTry_kh: post.oneThingToTry_kh || '',
        });
        setBodyKh(post.body_kh || '');
        if (editor && post.body) editor.commands.setContent(post.body);
      });
    }
  }, [isEdit, postId, editor]);

  // Auto-slug
  useEffect(() => {
    if (!isEdit && form.title) {
      setForm(f => ({ ...f, slug: createSlug(form.title) }));
    }
  }, [form.title, isEdit]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const storageRef = ref(storage, `covers/${uuidv4()}.${ext}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm(f => ({ ...f, coverImage: url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => files[0] && handleImageUpload(files[0]),
  });

  // AI helpers
  const aiAction = async (action: string) => {
    setAiLoading(action);
    try {
      const body = editor?.getHTML() || '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: action === 'excerpt'
              ? `Generate a compelling 2-sentence excerpt for this article:\n\n${body}`
              : action === 'translate'
              ? `Translate this English article title and excerpt to Khmer (ភាសាខ្មែរ):\nTitle: ${form.title}\nExcerpt: ${form.excerpt}\n\nReturn JSON: {title_kh, excerpt_kh}`
              : `Suggest 5 AI article ideas for Cambodia context. Return a numbered list.`,
          }],
          userId: user?.uid,
          sessionId: uuidv4(),
        }),
      });
      const data = await res.json();
      const content = data.content;

      if (action === 'excerpt') {
        setForm(f => ({ ...f, excerpt: content.trim() }));
        toast.success('Excerpt generated');
      } else if (action === 'translate') {
        try {
          const parsed = JSON.parse(content.replace(/```json|```/g, '').trim());
          setForm(f => ({ ...f, title_kh: parsed.title_kh || '', excerpt_kh: parsed.excerpt_kh || '' }));
          toast.success('Translation generated');
        } catch {
          toast.error('Could not parse translation');
        }
      } else {
        toast.success('Ideas fetched — check browser console for now');
        console.log(content);
      }
    } catch {
      toast.error('AI action failed');
    } finally {
      setAiLoading(null);
    }
  };

  const handleSave = async () => {
    if (!form.title || !editor) return;
    setSaving(true);
    try {
      const body = editor.getHTML();
      const postData = {
        ...form,
        body,
        body_kh: bodyKh,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        authorId: user?.uid || '',
      };

      if (isEdit && postId) {
        await updatePost(postId, postData);
        toast.success('Post updated!');
      } else {
        const id = await createPost(postData as any);
        toast.success('Post created!');
        router.push(`/admin/posts/${id}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-cream">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex gap-3">
          {form.slug && (
            <a href={`/blog/${form.slug}`} target="_blank" className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <Eye size={14} /> Preview
            </a>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5">
            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Title (English) *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-base text-lg" placeholder="Article title..." />
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Title (Khmer)</label>
              <input value={form.title_kh} onChange={e => setForm(f => ({ ...f, title_kh: e.target.value }))} className="input-base font-khmer" placeholder="ចំណងជើង..." />
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Slug</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="input-base font-mono text-sm" />
            </div>
          </div>

          {/* Body editor */}
          <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
            <div className="flex flex-wrap gap-1 p-3 border-b border-brand-border">
              {TOOLBAR.map((t, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!editor) return;
                    if (t.opts) (editor.chain().focus() as any)[`toggle${t.cmd.charAt(0).toUpperCase() + t.cmd.slice(1)}`](t.opts).run();
                    else (editor.chain().focus() as any)[`toggle${t.cmd.charAt(0).toUpperCase() + t.cmd.slice(1)}`]?.().run() || (editor.chain().focus() as any)[t.cmd]?.().run();
                  }}
                  className="px-2.5 py-1 text-xs font-mono text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 rounded transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-5 min-h-[350px]">
              <EditorContent editor={editor} className="prose prose-invert max-w-none" />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider">Excerpt (English)</label>
              <button onClick={() => aiAction('excerpt')} disabled={!!aiLoading} className="flex items-center gap-1 text-brand-gold text-xs font-mono hover:text-brand-gold-light">
                {aiLoading === 'excerpt' ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Generate
              </button>
            </div>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3} className="input-base resize-none" />
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Excerpt (Khmer)</label>
              <textarea value={form.excerpt_kh} onChange={e => setForm(f => ({ ...f, excerpt_kh: e.target.value }))} rows={3} className="input-base resize-none font-khmer" />
            </div>
          </div>

          {/* AI Frontier Brief sections */}
          {form.category === 'ai-frontier-brief' && (
            <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-5 space-y-4">
              <h3 className="text-brand-gold font-mono text-sm font-semibold">AI Frontier Brief Sections</h3>
              {[
                { key: 'theSignal', label: 'The Signal', key_kh: 'theSignal_kh', color: '#C9A84C' },
                { key: 'cambodiaLens', label: 'Cambodia Lens', key_kh: 'cambodiaLens_kh', color: '#3B82F6' },
                { key: 'oneThingToTry', label: 'One Thing to Try', key_kh: 'oneThingToTry_kh', color: '#10B981' },
              ].map(s => (
                <div key={s.key} className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider block" style={{ color: s.color }}>{s.label} (EN)</label>
                  <textarea
                    value={(form as any)[s.key]}
                    onChange={e => setForm(f => ({ ...f, [s.key]: e.target.value }))}
                    rows={3} className="input-base resize-none text-sm"
                  />
                  <label className="text-xs font-mono uppercase tracking-wider block" style={{ color: s.color + '99' }}>{s.label} (KH)</label>
                  <textarea
                    value={(form as any)[s.key_kh]}
                    onChange={e => setForm(f => ({ ...f, [s.key_kh]: e.target.value }))}
                    rows={2} className="input-base resize-none text-sm font-khmer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar settings */}
        <div className="space-y-5">
          {/* Publishing */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <h3 className="text-brand-cream font-semibold text-sm">Publishing</h3>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as PostCategory }))} className="input-base text-sm">
                <option value="ai-frontier-brief">AI Frontier Brief</option>
                <option value="the-long-view">The Long View</option>
                <option value="thought-leadership">Thought Leadership</option>
              </select>
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Read Time</label>
              <input value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} className="input-base text-sm" />
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Tags</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="ai, cambodia, agents..." className="input-base text-sm" />
            </div>
            <div className="space-y-3 pt-2">
              {[
                { key: 'published', label: 'Published' },
                { key: 'featured', label: 'Featured Post' },
              ].map(t => (
                <label key={t.key} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, [t.key]: !(f as any)[t.key] }))}
                    className={cn(
                      'w-10 h-5 rounded-full transition-colors relative',
                      (form as any)[t.key] ? 'bg-brand-gold' : 'bg-brand-border'
                    )}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform', (form as any)[t.key] ? 'translate-x-5' : 'translate-x-0.5')} />
                  </div>
                  <span className="text-brand-cream text-sm">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5">
            <h3 className="text-brand-cream font-semibold text-sm mb-3">Cover Image</h3>
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-border hover:border-brand-gold/40'
              )}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <Loader size={20} className="animate-spin text-brand-gold mx-auto" />
              ) : form.coverImage ? (
                <div>
                  <img src={form.coverImage} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />
                  <p className="text-brand-muted text-xs">Click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <Upload size={20} className="text-brand-muted mx-auto mb-2" />
                  <p className="text-brand-muted text-xs">{isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}</p>
                </div>
              )}
            </div>
            {form.coverImage && (
              <input value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} className="input-base text-xs mt-2" placeholder="Or paste image URL" />
            )}
          </div>

          {/* AI Tools */}
          <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-5">
            <h3 className="text-brand-gold font-semibold text-sm mb-3 flex items-center gap-2"><Sparkles size={14} /> AI Writing Tools</h3>
            <div className="space-y-2">
              {[
                { action: 'excerpt', label: 'Generate Excerpt' },
                { action: 'translate', label: 'Translate to Khmer' },
                { action: 'ideas', label: 'Suggest Topics' },
              ].map(t => (
                <button
                  key={t.action}
                  onClick={() => aiAction(t.action)}
                  disabled={!!aiLoading}
                  className="w-full text-left px-3 py-2 text-sm text-brand-muted hover:text-brand-gold hover:bg-brand-gold/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  {aiLoading === t.action ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
