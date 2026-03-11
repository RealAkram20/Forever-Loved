/**
 * Memorial public page - AJAX interactions, no page reload
 */
document.addEventListener('DOMContentLoaded', () => {
    const memorialSlug = document.querySelector('[data-memorial-slug]')?.dataset.memorialSlug;
    const canEdit = document.querySelector('[data-can-edit]')?.dataset.canEdit === '1';
    const canUpload = document.querySelector('[data-can-upload]')?.dataset.canUpload === '1';
    const isAuthenticated = document.querySelector('[data-is-authenticated]')?.dataset.isAuthenticated === '1';

    if (!memorialSlug) return;

    const container = document.querySelector('[data-memorial-slug]');
    const tributeUrl = container?.dataset.tributeUrl;
    const scrollToTributeId = container?.dataset.scrollTribute || '';
    const scrollToChapterId = container?.dataset.scrollChapter || '';
    const baseUrl = tributeUrl ? tributeUrl.replace(/\/tribute$/, '') : `/m/${memorialSlug}`;
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content;

    const fetchOpts = (method, body = null) => ({
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrf,
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: body ? JSON.stringify(body) : null,
    });

    const formDataOpts = (body) => ({
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrf,
            'X-Requested-With': 'XMLHttpRequest',
        },
        body,
    });

    function shareDropdownHtml(url) {
        return `<a href="#" data-share="whatsapp" data-share-url="${url}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-300 group">
            <svg class="h-5 w-5 text-[#25D366] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span class="group-hover:text-[#25D366] transition">WhatsApp</span>
        </a>
        <a href="#" data-share="facebook" data-share-url="${url}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-700 dark:text-gray-300 group">
            <svg class="h-5 w-5 text-[#1877F2] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span class="group-hover:text-[#1877F2] transition">Facebook</span>
        </a>
        <a href="#" data-share="linkedin" data-share-url="${url}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition hover:bg-sky-50 dark:hover:bg-sky-950/30 text-gray-700 dark:text-gray-300 group">
            <svg class="h-5 w-5 text-[#0A66C2] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span class="group-hover:text-[#0A66C2] transition">LinkedIn</span>
        </a>
        <div class="my-1 border-t border-gray-100 dark:border-gray-700"></div>
        <button type="button" data-share="copy" data-share-url="${url}" class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 group">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-500 shrink-0 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            <span class="group-hover:text-brand-500 transition">Copy link</span>
        </button>`;
    }

    // --- Tab switching ---
    function switchToTab(panelId) {
        const btn = document.querySelector(`.memorial-tab-btn[data-tab-panel="${panelId}"]`);
        if (btn) btn.click();
    }
    document.querySelectorAll('.memorial-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panelId = btn.dataset.tabPanel;
            document.querySelectorAll('.memorial-tab-btn').forEach(b => {
                b.classList.remove('text-brand-600', 'dark:text-brand-400', 'border-brand-500', 'bg-brand-50/50', 'dark:bg-brand-500/10');
                b.classList.add('text-gray-600', 'dark:text-gray-400', 'border-transparent');
            });
            btn.classList.add('text-brand-600', 'dark:text-brand-400', 'border-brand-500', 'bg-brand-50/50', 'dark:bg-brand-500/10');
            btn.classList.remove('text-gray-600', 'dark:text-gray-400', 'border-transparent');

            document.querySelectorAll('.memorial-tab-panel').forEach(p => p.classList.add('hidden'));
            const panel = document.getElementById('tab-' + panelId);
            if (panel) panel.classList.remove('hidden');

            document.querySelectorAll('.memorial-tab').forEach(a => {
                a.classList.remove('text-brand-600', 'dark:text-brand-400');
                a.classList.add('text-gray-600', 'dark:text-gray-400');
                if (a.dataset.tab === panelId) {
                    a.classList.add('text-brand-600', 'dark:text-brand-400');
                    a.classList.remove('text-gray-600', 'dark:text-gray-400');
                }
            });
        });
    });
    document.querySelectorAll('.memorial-tab').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            switchToTab(a.dataset.tab);
        });
    });

    // --- Chapter filter ---
    document.querySelectorAll('.chapter-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            const chapterId = btn.dataset.chapter || '';
            document.querySelectorAll('.chapter-filter').forEach(b => b.classList.remove('bg-brand-50', 'dark:bg-brand-500/20', 'text-brand-600', 'dark:text-brand-400'));
            document.querySelectorAll('.chapter-filter').forEach(b => b.classList.add('text-gray-600', 'dark:text-gray-400'));
            btn.classList.add('bg-brand-50', 'dark:bg-brand-500/20', 'text-brand-600', 'dark:text-brand-400');
            btn.classList.remove('text-gray-600', 'dark:text-gray-400');

            document.querySelectorAll('#life-feed article').forEach(article => {
                const artChapter = article.dataset.chapterId || '';
                article.style.display = (chapterId === '' || artChapter === chapterId) ? '' : 'none';
            });
        });
    });

    // --- Profile photo upload ---
    if (canEdit) {
        document.getElementById('profile-photo-input')?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('photo', file);
            fd.append('_token', csrf);
            fetch(`${baseUrl}/profile-photo`, formDataOpts(fd))
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        const container = document.querySelector('.relative.group.mb-4 > div');
                        if (container) {
                            container.innerHTML = `<img src="${data.url}" alt="" class="h-full w-full object-cover" />`;
                        }
                    }
                });
            e.target.value = '';
        });
    }

    // --- Gallery upload ---
    if (canUpload) {
        document.getElementById('gallery-upload')?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('file', file);
            fd.append('_token', csrf);
            fetch(`${baseUrl}/gallery`, formDataOpts(fd))
                .then(r => r.json())
                .then(data => {
                    if (data.success && data.media) {
                        const grid = document.getElementById('gallery-grid');
                        if (grid) {
                            const isVideo = data.media.type === 'video';
                            const el = isVideo
                                ? `<div class="aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"><video src="${data.media.url}" controls class="h-full w-full object-cover"></video></div>`
                                : `<a href="${data.media.url}" target="_blank" class="block aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"><img src="${data.media.url}" alt="" class="h-full w-full object-cover" /></a>`;
                            grid.insertAdjacentHTML('beforeend', el);
                        }
                    } else if (data.error) {
                        alert(data.error);
                    }
                });
            e.target.value = '';
        });
    }

    // --- Quill editors ---
    let chapterQuill, tributeQuill, biographyQuill;
    if (typeof Quill !== 'undefined') {
        const quillToolbar = [
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }],
            ['link', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean'],
            ['code-block']
        ];
        const quillOpts = {
            theme: 'snow',
            placeholder: 'Share your memories...',
            modules: {
                toolbar: quillToolbar
            }
        };
        if (document.getElementById('chapter-editor')) {
            chapterQuill = new Quill('#chapter-editor', quillOpts);
            chapterQuill.on('text-change', () => {
                const el = document.getElementById('chapter-content');
                if (el) el.value = chapterQuill.root.innerHTML;
            });
        }
        if (document.getElementById('tribute-editor')) {
            tributeQuill = new Quill('#tribute-editor', quillOpts);
            tributeQuill.on('text-change', () => {
                const el = document.getElementById('tribute-note-message');
                if (el) el.value = tributeQuill.root.innerHTML;
            });
        }
        if (document.getElementById('biography-editor')) {
            biographyQuill = new Quill('#biography-editor', quillOpts);
            biographyQuill.on('text-change', () => {
                const el = document.getElementById('biography-content');
                if (el) el.value = biographyQuill.root.innerHTML;
            });
        }
    }

    // --- Add story (tribute post) - any authenticated user can add ---
    const addStoryForm = document.getElementById('add-story-form');
    const addStoryBtnTop = document.getElementById('add-story-btn-top');
    const cancelStoryBtn = document.getElementById('cancel-story-btn');
    const tributePostForm = document.getElementById('tribute-post-form');
    const chapterFormAnchor = document.getElementById('chapter-form-anchor');

    addStoryBtnTop?.addEventListener('click', () => {
        switchToTab('life');
        setTimeout(() => {
            const target = addStoryForm || chapterFormAnchor;
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                const titleInput = addStoryForm?.querySelector('input[name="title"]');
                const editor = document.querySelector('#chapter-editor .ql-editor');
                if (titleInput) titleInput.focus();
                else if (editor) editor.focus();
            }, 300);
        }, 150);
    });

    if (addStoryForm) {
        let chapterFormSubmitting = false;

        cancelStoryBtn?.addEventListener('click', () => {
            if (chapterQuill) chapterQuill.setText('');
            tributePostForm?.reset();
        });

        tributePostForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (chapterFormSubmitting) return;
            chapterFormSubmitting = true;

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Posting...';
            form.style.pointerEvents = 'none';

            const resetButton = () => {
                chapterFormSubmitting = false;
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                form.style.pointerEvents = '';
            };

            const fd = new FormData();
            fd.append('idempotency_key', crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2));
            fd.append('title', form.title?.value || '');
            fd.append('content', chapterQuill ? chapterQuill.root.innerHTML : (form.content?.value || ''));
            fd.append('_token', csrf);
            if (!isAuthenticated) {
                const guestName = document.getElementById('chapter-guest-name')?.value?.trim();
                const guestEmail = document.getElementById('chapter-guest-email')?.value?.trim();
                if (!guestName || !guestEmail) {
                    alert('Please enter your name and email to add your chapter.');
                    resetButton();
                    return;
                }
                fd.append('guest_name', guestName);
                fd.append('guest_email', guestEmail);
            }
            const files = form.querySelector('input[name="files[]"]')?.files;
            if (files?.length) {
                for (let i = 0; i < files.length; i++) {
                    fd.append('files[]', files[i]);
                }
            }
            fetch(`${baseUrl}/tribute-post`, formDataOpts(fd))
                .then(r => r.json())
                .then(data => {
                    if (data.success && data.post) {
                        const feed = document.getElementById('life-feed');
                        if (feed) {
                            const p = data.post;
                            const mediaHtml = (p.media || []).map(m => {
                                if (m.type === 'photo') return `<img src="${m.url}" alt="" class="max-w-full rounded-lg mt-2" />`;
                                if (m.type === 'video') return `<video src="${m.url}" controls class="max-w-full rounded-lg mt-2"></video>`;
                                if (m.type === 'music') return `<audio src="${m.url}" controls class="w-full mt-2"></audio>`;
                                return '';
                            }).join('');
                            const article = document.createElement('article');
                            article.id = 'chapter-' + p.id;
                            article.className = 'relative overflow-visible rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]';
                            article.dataset.postId = p.id;
                            article.dataset.chapterId = '';
                            const initial = (p.author || '?').charAt(0).toUpperCase();
                            article.innerHTML = `
                                <div class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/30 text-brand-600 dark:text-brand-400 text-sm font-semibold">${escapeHtml(initial)}</div>
                                        <div>
                                            <p class="font-medium text-gray-900 dark:text-white/90">${escapeHtml(p.author)}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">${p.created_at_iso ? `<span class="time-ago" data-created-at="${p.created_at_iso}">${p.created_at}</span>` : p.created_at} · ${escapeHtml(p.chapter || 'Life')}</p>
                                        </div>
                                    </div>
                                    ${p.title ? `<h3 class="mt-2 font-medium text-gray-900 dark:text-white/90">${escapeHtml(p.title)}</h3>` : ''}
                                    ${p.content ? `<div class="mt-2 text-sm text-gray-700 dark:text-gray-300 prose prose-sm max-w-none">${p.content}</div>` : ''}
                                    ${mediaHtml ? `<div class="mt-3 space-y-2">${mediaHtml}</div>` : ''}
                                </div>
                                <div class="relative z-10 flex items-center gap-4 border-t border-gray-100 dark:border-gray-800 px-4 py-2">
                                    <div class="relative flex items-center gap-1" data-reaction-container="${p.id}">
                                        <button type="button" data-reaction-btn data-reactionable-type="post" data-reactionable-id="${p.id}" data-reaction-type="like" class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400">
                                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                                            <span data-post-id="${p.id}" data-reaction-count class="text-sm text-gray-600 dark:text-gray-400">0</span>
                                        </button>
                                    </div>
                                    <div class="relative flex items-center gap-1" data-comment-container="${p.id}">
                                        <button type="button" data-comment-toggle data-post-id="${p.id}" class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                            <span data-post-id="${p.id}" data-comment-count class="text-sm text-gray-600 dark:text-gray-400">0</span>
                                        </button>
                                        <div data-comment-dropdown="${p.id}" class="absolute left-0 top-full z-[9999] mt-1 hidden w-full min-w-[320px] max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
                                            <div class="border-b border-gray-100 dark:border-gray-700 p-3">
                                                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Add your comment</p>
                                                <div class="flex gap-2">
                                                    <input type="text" data-comment-input="${p.id}" placeholder="Write a comment..." class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm" />
                                                    <button type="button" data-comment-submit data-post-id="${p.id}" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Post</button>
                                                </div>
                                            </div>
                                            <div class="max-h-48 overflow-y-auto p-3" data-comments-list="${p.id}"></div>
                                            <p data-comments-empty="${p.id}" class="px-3 py-4 text-center text-sm text-gray-500">No comments yet. Add a comment.</p>
                                        </div>
                                    </div>
                                    <div class="relative ml-auto" data-share-container="${p.id}">
                                        <button type="button" data-share-toggle data-share-url="${(p.share_id ? `${window.location.origin}/${memorialSlug}/chapter/${p.share_id}` : `${window.location.origin}/${memorialSlug}/chapter/${p.id}`)}" data-post-id="${p.id}" class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                                            Share
                                        </button>
                                        <div data-share-dropdown="${p.id}" class="absolute right-0 top-full z-[9999] mt-1 hidden w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-1.5">
                                            ${shareDropdownHtml(p.share_id ? `${window.location.origin}/${memorialSlug}/chapter/${p.share_id}` : `${window.location.origin}/${memorialSlug}/chapter/${p.id}`)}
                                        </div>
                                    </div>
                                </div>
                            `;
                            feed.prepend(article);
                            article.querySelector('[data-reaction-btn]')?.addEventListener('click', function() {
                                const payload = { reactionable_type: 'post', reactionable_id: p.id, type: 'like' };
                                const doR = (name, email) => {
                                    fetch(`${baseUrl}/reaction`, fetchOpts('POST', { ...payload, guest_name: name, guest_email: email }))
                                        .then(r => r.json())
                                        .then(d => { if (d.success) { const el = article.querySelector(`[data-reaction-container="${p.id}"] [data-reaction-count]`); if (el) el.textContent = d.count; } });
                                };
                                isAuthenticated ? doR() : showGuestModal({ type: 'reaction', payload, callback: doR });
                            });
                            article.querySelector('[data-comment-toggle]')?.addEventListener('click', () => {
                                article.querySelector(`[data-post-comments="${p.id}"]`)?.classList.toggle('hidden');
                            });
                            article.querySelector('[data-comment-submit]')?.addEventListener('click', function() {
                                const btn = this;
                                const input = article.querySelector(`[data-comment-input="${p.id}"]`);
                                const content = input?.value?.trim();
                                if (!content) return;
                                if (btn.disabled) return;
                                btn.disabled = true;
                                const origText = btn.textContent;
                                btn.textContent = 'Posting...';
                                const resetBtn = () => { btn.disabled = false; btn.textContent = origText; };
                                const doSubmit = (guestName, guestEmail) => {
                                    const body = { content };
                                    if (guestName) body.guest_name = guestName;
                                    if (guestEmail) body.guest_email = guestEmail;
                                    fetch(`${baseUrl}/posts/${p.id}/comments`, fetchOpts('POST', body))
                                        .then(r => r.json())
                                        .then(data => {
                                            if (data.success && data.comment) {
                                                const list = article.querySelector(`[data-comments-list="${p.id}"]`);
                                                if (list) {
                                                    const div = document.createElement('div');
                                                    div.className = 'rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2';
                                                    div.innerHTML = `<p class="text-sm font-medium text-gray-900 dark:text-white/90">${escapeHtml(data.comment.author)}</p><p class="text-sm text-gray-700 dark:text-gray-300">${escapeHtml(data.comment.content)}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapeHtml(data.comment.created_at)}</p>`;
                                                    list.appendChild(div);
                                                }
                                                const countEl = article.querySelector(`[data-comment-container="${p.id}"] [data-comment-count]`);
                                                if (countEl) countEl.textContent = parseInt(countEl.textContent || 0) + 1;
                                                input.value = '';
                                            } else if (data.error) alert(data.error);
                                            resetBtn();
                                        })
                                        .catch(() => { alert('Something went wrong.'); resetBtn(); });
                                };
                                isAuthenticated ? doSubmit() : showGuestModal({ type: 'comment', payload: { content }, callback: (name, email) => doSubmit(name, email) });
                            });
                        }
                        if (chapterQuill) chapterQuill.setText('');
                        form.reset();
                    } else if (data.error) {
                        alert(data.error);
                    }
                    resetButton();
                })
                .catch(() => {
                    alert('Something went wrong. Please try again.');
                    resetButton();
                });
        });
    }

    // --- Inline editing (admin/owner only) ---
    if (canEdit) {
        document.querySelectorAll('[data-editable]').forEach(el => {
            const section = el.dataset.editable;
            const displayEl = el.querySelector('[data-display]');
            const editEl = el.querySelector('[data-edit]');
            const pencilBtn = el.querySelector('[data-edit-trigger]');

            if (!displayEl || !editEl || !pencilBtn) return;

            const plainToHtml = (text) => {
                if (!text || !String(text).trim()) return '';
                const div = document.createElement('div');
                div.textContent = text;
                const escaped = div.innerHTML;
                const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                const paragraphs = withBold.split(/\n\n+/).filter(p => p.trim());
                if (paragraphs.length === 0) return withBold.replace(/\n/g, '<br>');
                return paragraphs.map(p => '<p>' + p.trim().replace(/\n/g, '<br>') + '</p>').join('');
            };

            pencilBtn.addEventListener('click', () => {
                displayEl.classList.add('hidden');
                editEl.classList.remove('hidden');
                const input = editEl.querySelector('input, textarea');
                if (section === 'biography' && biographyQuill) {
                    // Use display content as source (what's shown on page) - most reliable
                    let initial = '';
                    const placeholder = 'Add biography...';
                    if (displayEl.textContent.trim() !== placeholder) {
                        initial = displayEl.innerHTML.trim();
                    }
                    requestAnimationFrame(() => {
                        biographyQuill.setContents([]);
                        if (initial) {
                            if (initial.includes('<')) {
                                biographyQuill.clipboard.dangerouslyPasteHTML(0, initial);
                            } else {
                                const html = plainToHtml(initial);
                                biographyQuill.clipboard.dangerouslyPasteHTML(0, html);
                            }
                        }
                        biographyQuill.focus();
                    });
                } else if (input) {
                    if (section !== 'biography') {
                        input.value = displayEl.textContent.trim();
                    }
                    input.focus();
                }
            });

            const formatBiography = (text) => {
                if (!text || !String(text).trim()) return 'Add biography...';
                const div = document.createElement('div');
                div.textContent = text;
                const escaped = div.innerHTML;
                return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            };

            const save = () => {
                const saveBtn = editEl.querySelector('[data-save]');
                const origText = saveBtn?.textContent || 'Save';
                if (saveBtn) {
                    saveBtn.textContent = saveBtn.dataset.savingText || 'Saving...';
                    saveBtn.disabled = true;
                }

                let body = { section };
                if (section === 'dates') {
                    const birthInput = editEl.querySelector('[data-date-type="birth"]');
                    const deathInput = editEl.querySelector('[data-date-type="death"]');
                    body.date_of_birth = birthInput?.value || null;
                    body.date_of_passing = deathInput?.value || null;
                } else if (section === 'biography' && biographyQuill) {
                    body.value = biographyQuill.root.innerHTML?.trim() ?? '';
                } else {
                    const input = editEl.querySelector('input, textarea');
                    body.value = input?.value?.trim() ?? '';
                }

                fetch(`${baseUrl}/section`, fetchOpts('PATCH', body))
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            if (section === 'dates') {
                                const birthInput = editEl.querySelector('[data-date-type="birth"]');
                                const deathInput = editEl.querySelector('[data-date-type="death"]');
                                const parts = [];
                                if (birthInput?.value) parts.push(birthInput.value);
                                if (deathInput?.value) parts.push(deathInput.value);
                                displayEl.textContent = parts.join(' – ') || 'Add dates';
                            } else if (section === 'biography') {
                                const value = biographyQuill ? biographyQuill.root.innerHTML?.trim() ?? '' : (editEl.querySelector('input, textarea')?.value?.trim() ?? '');
                                displayEl.innerHTML = value && value !== '<p><br></p>' ? (value.includes('<') ? value : formatBiography(value)) : formatBiography('');
                            } else {
                                const input = editEl.querySelector('input, textarea');
                                const value = input?.value?.trim() ?? '';
                                displayEl.textContent = value || (section === 'date_of_birth' || section === 'date_of_passing' ? '' : '—');
                            }
                            displayEl.classList.remove('hidden');
                            editEl.classList.add('hidden');
                        }
                    })
                    .catch(() => {})
                    .finally(() => {
                        if (saveBtn) {
                            saveBtn.textContent = saveBtn.dataset.saveText || origText;
                            saveBtn.disabled = false;
                        }
                    });
            };

            editEl.querySelector('[data-save]')?.addEventListener('click', save);
            editEl.querySelector('input, textarea')?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    save();
                }
                if (e.key === 'Escape') {
                    displayEl.classList.remove('hidden');
                    editEl.classList.add('hidden');
                }
            });
        });
    }

    // --- Guest modal (name + email for tributes/reactions) ---
    const guestModal = document.getElementById('guest-modal');
    const guestForm = document.getElementById('guest-form');
    let pendingAction = null;

    window.showGuestModal = (action) => {
        pendingAction = action;
        guestModal?.classList.remove('hidden');
    };

    window.hideGuestModal = () => {
        guestModal?.classList.add('hidden');
        pendingAction = null;
    };

    guestForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('guest-name')?.value?.trim();
        const email = document.getElementById('guest-email')?.value?.trim();
        if (!name || !email) return;

        if (pendingAction?.type === 'tribute') {
            submitTribute(pendingAction.payload, name, email);
            const msgEl = document.getElementById('tribute-note-message');
            if (msgEl) msgEl.value = '';
        } else if (pendingAction?.type === 'reaction') {
            pendingAction.callback?.(name, email) ?? submitReaction(pendingAction.payload, name, email);
        } else if (pendingAction?.type === 'comment') {
            pendingAction.callback?.(name, email);
        }
        hideGuestModal();
    });

    // --- Tribute (flower, candle, note) ---
    function submitTribute(payload, guestName, guestEmail) {
        const body = { ...payload };
        if (guestName) body.guest_name = guestName;
        if (guestEmail) body.guest_email = guestEmail;
        const url = tributeUrl || `${baseUrl}/tribute`;
        fetch(url, fetchOpts('POST', body))
            .then(async (r) => {
                const data = await r.json().catch(() => ({}));
                if (!r.ok) {
                    const msg = data.error || data.message || (data.errors && Object.values(data.errors).flat().find(Boolean)) || `Request failed (${r.status})`;
                    throw new Error(msg);
                }
                return data;
            })
            .then(data => {
                if (data.success) {
                    appendTribute(data.tribute);
                    updateTributeCount();
                } else if (data.requires_login) {
                    hideGuestModal();
                    alert(data.error + ' You can sign in at: ' + window.location.origin + '/login/code');
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(err => {
                console.error('Tribute error:', err);
                alert(err.message || 'Could not submit tribute. Please try again.');
            });
    }

    document.getElementById('invite-share-btn')?.addEventListener('click', () => {
        const dropdown = document.getElementById('invite-share-dropdown');
        dropdown?.classList.toggle('hidden');
    });
    document.querySelector('[data-share="invite"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = document.getElementById('invite-share-btn')?.dataset?.shareUrl || window.location.href;
        trackShare('invite');
        navigator.clipboard.writeText(url).then(() => {
            const btn = e.target;
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = orig; }, 1500);
        });
        document.getElementById('invite-share-dropdown')?.classList.add('hidden');
    });

    document.getElementById('add-tribute-btn')?.addEventListener('click', () => {
        switchToTab('tributes');
        setTimeout(() => {
            document.getElementById('tribute-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const editor = document.querySelector('#tribute-editor .ql-editor');
            if (editor) editor.focus();
        }, 100);
    });

    document.querySelectorAll('[data-tribute-btn]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.dataset.tributeBtn;
            if (type === 'note') {
                document.querySelectorAll('.memorial-tab-btn').forEach(b => {
                    if (b.dataset.tabPanel === 'tributes') b.click();
                });
                return;
            }

            if (isAuthenticated) {
                submitTribute({ type });
            } else {
                showGuestModal({ type: 'tribute', payload: { type } });
            }
        });
    });

    document.getElementById('tribute-note-submit')?.addEventListener('click', () => {
        const name = document.getElementById('tribute-note-name')?.value?.trim();
        const email = document.getElementById('tribute-note-email')?.value?.trim();
        const typeEl = document.querySelector('input[name="tribute-type"]:checked');
        const type = typeEl?.value || 'note';
        const message = tributeQuill ? tributeQuill.root.innerHTML : (document.getElementById('tribute-note-message')?.value?.trim() || '');
        if (!message || message === '<p><br></p>') return;

        if (isAuthenticated) {
            submitTribute({ type, message });
        } else if (name && email) {
            submitTribute({ type, message }, name, email);
        } else {
            showGuestModal({ type: 'tribute', payload: { type, message } });
            return;
        }
        if (tributeQuill) tributeQuill.setText('');
    });

    const tributeCardConfig = {
        flower: {
            card: 'border-pink-200/60 dark:border-pink-800/40 bg-pink-50/40 dark:bg-pink-950/20',
            avatar: 'bg-pink-200/70 dark:bg-pink-800/40 text-pink-700 dark:text-pink-300',
            inner: 'bg-pink-100/50 dark:bg-pink-900/20 border border-pink-200/40 dark:border-pink-800/30',
            label: 'text-pink-600 dark:text-pink-400',
            labelText: 'Flower Left',
            border: 'border-pink-200/40 dark:border-pink-800/30',
            icon: '<svg class="h-6 w-6 text-pink-400 tribute-icon-sway" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.5 2 7.5 4.5 7.5 7c0 1.8 1 3.4 2.5 4.2V22h4V11.2c1.5-.8 2.5-2.4 2.5-4.2 0-2.5-2-5-4.5-5zm-2 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>',
            inlineIcon: '<svg class="h-10 w-10 tribute-icon-sway" viewBox="0 0 48 48" fill="none"><g transform="translate(24,20)"><ellipse cx="0" cy="-8" rx="5" ry="8" fill="#f9a8d4" opacity="0.9" transform="rotate(0)"/><ellipse cx="0" cy="-8" rx="5" ry="8" fill="#f472b6" opacity="0.8" transform="rotate(72)"/><ellipse cx="0" cy="-8" rx="5" ry="8" fill="#f9a8d4" opacity="0.9" transform="rotate(144)"/><ellipse cx="0" cy="-8" rx="5" ry="8" fill="#f472b6" opacity="0.8" transform="rotate(216)"/><ellipse cx="0" cy="-8" rx="5" ry="8" fill="#f9a8d4" opacity="0.9" transform="rotate(288)"/><circle cx="0" cy="0" r="4" fill="#fbbf24"/></g><line x1="24" y1="24" x2="24" y2="44" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="18" cy="36" rx="5" ry="3" fill="#86efac" opacity="0.7" transform="rotate(-30, 18, 36)"/></svg>',
            fallback: (name) => `A flower placed in memory of ${name}.`,
        },
        candle: {
            card: 'border-amber-200/60 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-950/20',
            avatar: 'bg-amber-200/70 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300',
            inner: 'bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200/40 dark:border-amber-800/30',
            label: 'text-amber-600 dark:text-amber-400',
            labelText: 'Candle Lit',
            border: 'border-amber-200/40 dark:border-amber-800/30',
            icon: '<svg class="h-6 w-6 text-amber-400 tribute-icon-flicker" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-.5 0-1 .19-1.41.59l-1.3 1.3C8.78 4.4 8.5 5.13 8.5 5.91c0 1.97 1.6 3.59 3.5 3.59s3.5-1.62 3.5-3.59c0-.78-.28-1.51-.79-2.02l-1.3-1.3C13 2.19 12.5 2 12 2zm-1 8.5V22h2V10.5h-2z"/></svg>',
            inlineIcon: '<svg class="h-10 w-10" viewBox="0 0 48 48" fill="none"><rect x="19" y="22" width="10" height="20" rx="2" fill="#fbbf24" opacity="0.85"/><rect x="20" y="22" width="3" height="20" rx="1" fill="#fde68a" opacity="0.4"/><rect x="23" y="20" width="2" height="3" rx="1" fill="#92400e"/><g class="tribute-flame-flicker" transform-origin="24 16"><ellipse cx="24" cy="14" rx="4.5" ry="7" fill="#f97316" opacity="0.9"/><ellipse cx="24" cy="13" rx="2.5" ry="5" fill="#fbbf24"/><ellipse cx="24" cy="12" rx="1.2" ry="3" fill="#fef3c7"/></g><ellipse cx="24" cy="9" rx="6" ry="3" fill="#fbbf24" opacity="0.15" class="tribute-glow-pulse"/></svg>',
            fallback: (name) => `A flame lit in honour of ${name}.`,
        },
        note: {
            card: 'border-gray-200/80 dark:border-gray-700/60 bg-gray-50/40 dark:bg-white/[0.02]',
            avatar: 'bg-gray-200/70 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300',
            inner: 'bg-white/60 dark:bg-white/[0.03] border border-gray-200/50 dark:border-gray-700/40',
            label: 'text-gray-500 dark:text-gray-400',
            labelText: 'Note Left',
            border: 'border-gray-200/50 dark:border-gray-700/40',
            icon: '<svg class="h-6 w-6 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>',
            inlineIcon: '<svg class="h-10 w-10 tribute-icon-write" viewBox="0 0 48 48" fill="none"><path d="M34 6c-6 4-12 14-16 24l-2 8 6-4c4-8 8-16 14-22" fill="#94a3b8" opacity="0.15"/><path d="M34 6c-6 4-12 14-16 24l-2 8 6-4c4-8 8-16 14-22z" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 30l-2 8" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/><circle cx="15" cy="39" r="1.5" fill="#64748b" opacity="0.5" class="tribute-ink-dot"/></svg>',
            fallback: (name) => `A note left for ${name}.`,
        },
    };

    const deceasedFirst = container?.dataset.deceasedFirst || 'them';

    function updateTributeFilterCounts(type, delta) {
        const typeEl = document.querySelector(`[data-count-${type}]`);
        const allEl = document.querySelector('[data-count-all]');
        if (typeEl) typeEl.textContent = parseInt(typeEl.textContent || '0', 10) + delta;
        if (allEl) allEl.textContent = parseInt(allEl.textContent || '0', 10) + delta;
    }

    function getInitials(name) {
        return name.split(/\s+/).map(w => w.charAt(0).toUpperCase()).slice(0, 2).join('');
    }

    function appendTribute(t) {
        const list = document.querySelector('[data-tributes-list]');
        if (!list) return;
        document.querySelectorAll('.memorial-tab-btn').forEach(b => {
            if (b.dataset.tabPanel === 'tributes') b.click();
        });

        const cfg = tributeCardConfig[t.type] || tributeCardConfig.note;
        const shareUrl = t.share_id ? `${window.location.origin}/${memorialSlug}/tribute/${t.share_id}` : `${window.location.origin}/${memorialSlug}/tribute/${t.id || 'new'}`;
        const timeEl = t.created_at_iso ? `<p class="text-xs text-gray-500 dark:text-gray-400 time-ago" data-created-at="${t.created_at_iso}">${escapeHtml(t.created_at)}</p>` : `<p class="text-xs text-gray-500 dark:text-gray-400">${escapeHtml(t.created_at)}</p>`;
        const initials = getInitials(t.author || 'A');
        const textContent = t.message
            ? `<p class="mb-1 text-xs font-semibold uppercase tracking-wider ${cfg.label}">${cfg.labelText}</p>
               <div class="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">${t.message}</div>`
            : `<p class="text-sm italic ${cfg.label}" style="opacity:0.8">${cfg.fallback(escapeHtml(deceasedFirst))}</p>`;
        const contentBlock = `<div class="mt-3 flex items-start gap-3 rounded-lg p-3 ${cfg.inner}">
            <div class="shrink-0 mt-0.5">${cfg.inlineIcon}</div>
            <div class="min-w-0 flex-1">${textContent}</div>
        </div>`;

        const div = document.createElement('div');
        div.id = 'tribute-' + (t.id || 'new');
        div.dataset.tributeId = t.id || 'new';
        div.dataset.tributeType = t.type;
        div.className = `rounded-xl border p-4 transition ${cfg.card}`;
        div.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${cfg.avatar}">${escapeHtml(initials)}</div>
                <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-900 dark:text-white/90 truncate">${escapeHtml(t.author)}</p>
                    ${timeEl}
                </div>
                <div class="shrink-0">${cfg.icon}</div>
            </div>
            ${contentBlock}
            <div class="mt-3 flex items-center justify-between border-t pt-3 ${cfg.border}">
                <div class="flex items-center gap-4">
                    <button type="button" class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition">
                        <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        <span>0</span>
                    </button>
                </div>
                <div class="relative" data-share-container data-tribute-id="${t.id || 'new'}">
                    <button type="button" data-share-toggle data-share-url="${shareUrl}" class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition">
                        <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                        Reply
                    </button>
                    <div data-share-dropdown-tribute class="absolute right-0 top-full z-[9999] mt-1 hidden w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-1.5">
                        ${shareDropdownHtml(shareUrl)}
                    </div>
                </div>
            </div>
        `;
        list.prepend(div);
        const emptyEl = document.querySelector('[data-tributes-empty]');
        if (emptyEl) emptyEl.classList.add('hidden');
        updateTributeFilterCounts(t.type, 1);
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        div.querySelectorAll('[data-share]').forEach(b => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                const url = b.dataset.shareUrl;
                const encoded = encodeURIComponent(url);
                const shareType = ['whatsapp', 'facebook', 'linkedin', 'copy'].includes(b.dataset.share) ? b.dataset.share : 'copy';
                trackShare(shareType);
                if (b.dataset.share === 'copy') {
                    navigator.clipboard.writeText(url).then(() => { const orig = b.textContent; b.textContent = 'Copied'; setTimeout(() => b.textContent = orig, 1500); });
                } else if (b.dataset.share === 'whatsapp') {
                    window.open(`https://wa.me/?text=${encodeURIComponent(document.title)}%20${encoded}`, '_blank');
                } else if (b.dataset.share === 'facebook') {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank');
                } else if (b.dataset.share === 'linkedin') {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, '_blank');
                }
            });
        });
    }

    function updateTributeCount() {
        const el = document.querySelector('[data-tribute-count]');
        if (el) el.textContent = parseInt(el.textContent || 0) + 1;
    }

    // --- Reactions on posts ---
    function submitReaction(payload, guestName, guestEmail) {
        fetch(`${baseUrl}/reaction`, fetchOpts('POST', {
            ...payload,
            guest_name: guestName,
            guest_email: guestEmail,
        }))
            .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            const countEl = document.querySelector(`[data-reaction-container="${payload.reactionable_id}"] [data-reaction-count]`);
                            if (countEl) countEl.textContent = data.count;
                        }
                    });
    }

    document.querySelectorAll('[data-reaction-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
            const payload = {
                reactionable_type: btn.dataset.reactionableType,
                reactionable_id: parseInt(btn.dataset.reactionableId),
                type: btn.dataset.reactionType || 'like',
            };

            const doReaction = (name, email) => {
                const body = { ...payload };
                if (name) body.guest_name = name;
                if (email) body.guest_email = email;
                fetch(`${baseUrl}/reaction`, fetchOpts('POST', body))
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            const countEl = document.querySelector(`[data-reaction-container="${payload.reactionable_id}"] [data-reaction-count]`);
                            if (countEl) countEl.textContent = data.count;
                        }
                    });
            };

            if (isAuthenticated) {
                doReaction();
            } else {
                showGuestModal({ type: 'reaction', payload, callback: (name, email) => doReaction(name, email) });
            }
        });
    });

    // --- Comment toggle (dropdown) ---
    document.querySelectorAll('[data-comment-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const postId = btn.dataset.postId;
            const dropdown = document.querySelector(`[data-comment-dropdown="${postId}"]`);
            document.querySelectorAll('[data-comment-dropdown]').forEach(d => { if (d !== dropdown) d.classList.add('hidden'); });
            dropdown?.classList.toggle('hidden');
        });
    });

    // --- Share toggle (posts and tributes) ---
    document.addEventListener('click', (e) => {
        const shareToggle = e.target.closest('[data-share-toggle]');
        if (shareToggle) {
            e.preventDefault();
            e.stopPropagation();
            const postId = shareToggle.dataset.postId;
            const shareUrl = shareToggle.dataset.shareUrl;
            let dropdown;
            if (postId) {
                dropdown = document.querySelector(`[data-share-dropdown="${postId}"]`);
            } else if (shareUrl) {
                dropdown = shareToggle.nextElementSibling;
            }
            document.querySelectorAll('[data-share-dropdown], [data-share-dropdown-tribute]').forEach(d => { if (d !== dropdown) d.classList.add('hidden'); });
            dropdown?.classList.toggle('hidden');
            return;
        }
    });

    // --- Tribute comment toggle ---
    document.querySelectorAll('[data-tribute-comment-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tributeId = btn.dataset.tributeId;
            const dropdown = document.querySelector(`[data-tribute-comment-dropdown="${tributeId}"]`);
            document.querySelectorAll('[data-tribute-comment-dropdown]').forEach(d => { if (d !== dropdown) d.classList.add('hidden'); });
            document.querySelectorAll('[data-comment-dropdown]').forEach(d => d.classList.add('hidden'));
            dropdown?.classList.toggle('hidden');
        });
    });

    // --- Tribute comment submit ---
    document.querySelectorAll('[data-tribute-comment-submit]').forEach(btn => {
        btn.addEventListener('click', function() {
            const tributeId = parseInt(this.dataset.tributeId);
            const input = document.querySelector(`[data-tribute-comment-input="${tributeId}"]`);
            const content = input?.value?.trim();
            if (!content) return;
            if (this.disabled) return;
            this.disabled = true;
            const origText = this.textContent;
            this.textContent = 'Posting...';
            const resetBtn = () => { this.disabled = false; this.textContent = origText; };
            const doSubmit = (guestName, guestEmail) => {
                const body = { content };
                if (guestName) body.guest_name = guestName;
                if (guestEmail) body.guest_email = guestEmail;
                fetch(`${baseUrl}/tributes/${tributeId}/comments`, fetchOpts('POST', body))
                    .then(r => r.json())
                    .then(data => {
                        if (data.success && data.comment) {
                            const list = document.querySelector(`[data-tribute-comments-list="${tributeId}"]`);
                            const empty = document.querySelector(`[data-tribute-comments-empty="${tributeId}"]`);
                            if (list) {
                                const div = document.createElement('div');
                                div.className = 'mb-3 last:mb-0 rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2';
                                div.innerHTML = `<p class="text-sm font-medium text-gray-900 dark:text-white/90">${escapeHtml(data.comment.author)}</p><p class="text-sm text-gray-700 dark:text-gray-300">${escapeHtml(data.comment.content)}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapeHtml(data.comment.created_at)}</p>`;
                                list.appendChild(div);
                            }
                            if (empty) empty.classList.add('hidden');
                            const countEl = document.querySelector(`[data-tribute-comment-container="${tributeId}"] [data-tribute-comment-count]`);
                            if (countEl) countEl.textContent = parseInt((countEl.textContent || '0').replace(/\D/g, '') || 0) + 1;
                            input.value = '';
                        } else if (data.error) alert(data.error);
                        resetBtn();
                    })
                    .catch(() => { alert('Something went wrong.'); resetBtn(); });
            };
            if (isAuthenticated) doSubmit();
            else showGuestModal({ type: 'comment', payload: { content }, callback: (name, email) => doSubmit(name, email) });
        });
    });

    // --- Tribute reply toggle and submit ---
    document.addEventListener('click', (e) => {
        const replyBtn = e.target.closest('[data-tribute-reply-to]');
        if (replyBtn) {
            e.stopPropagation();
            const commentId = replyBtn.dataset.commentId;
            const form = document.querySelector(`[data-tribute-reply-form="${commentId}"]`);
            document.querySelectorAll('[data-tribute-reply-form]').forEach(f => { if (f !== form) f.classList.add('hidden'); });
            form?.classList.toggle('hidden');
            const input = document.querySelector(`[data-tribute-reply-input="${commentId}"]`);
            if (form?.classList.contains('hidden') === false && input) input.focus();
        }
    });

    document.addEventListener('click', (e) => {
        const submitBtn = e.target.closest('[data-tribute-reply-submit]');
        if (submitBtn) {
            e.stopPropagation();
            const tributeId = parseInt(submitBtn.dataset.tributeId);
            const parentId = parseInt(submitBtn.dataset.commentId);
            const input = document.querySelector(`[data-tribute-reply-input="${parentId}"]`);
            const content = input?.value?.trim();
            if (!content) return;
            if (submitBtn.disabled) return;
            submitBtn.disabled = true;
            const origText = submitBtn.textContent;
            submitBtn.textContent = 'Posting...';
            const resetBtn = () => { submitBtn.disabled = false; submitBtn.textContent = origText; };
            const doSubmit = (guestName, guestEmail) => {
                const body = { content, parent_id: parentId };
                if (guestName) body.guest_name = guestName;
                if (guestEmail) body.guest_email = guestEmail;
                fetch(`${baseUrl}/tributes/${tributeId}/comments`, fetchOpts('POST', body))
                    .then(r => r.json())
                    .then(data => {
                        if (data.success && data.comment) {
                            const repliesList = document.querySelector(`[data-tribute-replies-list="${parentId}"]`);
                            const replyForm = document.querySelector(`[data-tribute-reply-form="${parentId}"]`);
                            if (repliesList) {
                                const div = document.createElement('div');
                                div.className = 'mb-3 last:mb-0 rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2 ml-4 border-l-2 border-gray-200 dark:border-gray-700';
                                div.innerHTML = `<p class="text-sm font-medium text-gray-900 dark:text-white/90">${escapeHtml(data.comment.author)}</p><p class="text-sm text-gray-700 dark:text-gray-300">${escapeHtml(data.comment.content)}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapeHtml(data.comment.created_at)}</p>`;
                                repliesList.appendChild(div);
                            }
                            if (!repliesList) {
                                const parentComment = document.querySelector(`[data-tribute-comment-id="${parentId}"]`);
                                if (parentComment) {
                                    let list = parentComment.querySelector(`[data-tribute-replies-list="${parentId}"]`);
                                    if (!list) {
                                        list = document.createElement('div');
                                        list.className = 'mt-2 space-y-2';
                                        list.dataset.tributeRepliesList = parentId;
                                        parentComment.appendChild(list);
                                    }
                                    const div = document.createElement('div');
                                    div.className = 'mb-3 last:mb-0 rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2 ml-4 border-l-2 border-gray-200 dark:border-gray-700';
                                    div.innerHTML = `<p class="text-sm font-medium text-gray-900 dark:text-white/90">${escapeHtml(data.comment.author)}</p><p class="text-sm text-gray-700 dark:text-gray-300">${escapeHtml(data.comment.content)}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapeHtml(data.comment.created_at)}</p>`;
                                    list.appendChild(div);
                                }
                            }
                            const countEl = document.querySelector(`[data-tribute-comment-container="${tributeId}"] [data-tribute-comment-count]`);
                            if (countEl) countEl.textContent = parseInt((countEl.textContent || '0').replace(/\D/g, '') || 0) + 1;
                            input.value = '';
                            replyForm?.classList.add('hidden');
                        } else if (data.error) alert(data.error);
                        resetBtn();
                    })
                    .catch(() => { alert('Something went wrong.'); resetBtn(); });
            };
            if (isAuthenticated) doSubmit();
            else showGuestModal({ type: 'comment', payload: { content }, callback: (name, email) => doSubmit(name, email) });
        }
    });

    // --- Click outside to close dropdowns ---
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-comment-container], [data-share-container], [data-tribute-comment-container], #invite-share-btn, #invite-share-dropdown')) return;
        document.querySelectorAll('[data-comment-dropdown], [data-share-dropdown], [data-share-dropdown-tribute], [data-tribute-comment-dropdown]').forEach(d => d.classList.add('hidden'));
        document.getElementById('invite-share-dropdown')?.classList.add('hidden');
    });

    // --- Reply toggle and submit ---
    document.addEventListener('click', (e) => {
        const replyBtn = e.target.closest('[data-reply-to]');
        if (replyBtn) {
            e.stopPropagation();
            const commentId = replyBtn.dataset.commentId;
            const form = document.querySelector(`[data-reply-form="${commentId}"]`);
            document.querySelectorAll('[data-reply-form]').forEach(f => { if (f !== form) f.classList.add('hidden'); });
            form?.classList.toggle('hidden');
            const input = document.querySelector(`[data-reply-input="${commentId}"]`);
            if (form?.classList.contains('hidden') === false && input) input.focus();
        }
    });

    document.addEventListener('click', (e) => {
        const submitBtn = e.target.closest('[data-reply-submit]');
        if (submitBtn) {
            e.stopPropagation();
            const postId = parseInt(submitBtn.dataset.postId);
            const parentId = parseInt(submitBtn.dataset.commentId);
            const input = document.querySelector(`[data-reply-input="${parentId}"]`);
            const content = input?.value?.trim();
            if (!content) return;
            if (submitBtn.disabled) return;
            submitBtn.disabled = true;
            const origText = submitBtn.textContent;
            submitBtn.textContent = 'Posting...';
            const resetBtn = () => { submitBtn.disabled = false; submitBtn.textContent = origText; };
            const doSubmit = (guestName, guestEmail) => {
                const body = { content, parent_id: parentId };
                if (guestName) body.guest_name = guestName;
                if (guestEmail) body.guest_email = guestEmail;
                fetch(`${baseUrl}/posts/${postId}/comments`, fetchOpts('POST', body))
                    .then(r => r.json())
                    .then(data => {
                        if (data.success && data.comment) {
                            const repliesList = document.querySelector(`[data-replies-list="${parentId}"]`);
                            const replyForm = document.querySelector(`[data-reply-form="${parentId}"]`);
                            if (repliesList) {
                                const div = document.createElement('div');
                                div.className = 'mb-3 last:mb-0 rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2 ml-4 border-l-2 border-gray-200 dark:border-gray-700';
                                div.innerHTML = `<p class="text-sm font-medium text-gray-900 dark:text-white/90">${escapeHtml(data.comment.author)}</p><p class="text-sm text-gray-700 dark:text-gray-300">${escapeHtml(data.comment.content)}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapeHtml(data.comment.created_at)}</p>`;
                                repliesList.appendChild(div);
                            }
                            if (!repliesList) {
                                const parentComment = document.querySelector(`[data-comment-id="${parentId}"]`);
                                if (parentComment) {
                                    let list = parentComment.querySelector(`[data-replies-list="${parentId}"]`);
                                    if (!list) {
                                        list = document.createElement('div');
                                        list.className = 'mt-2 space-y-2';
                                        list.dataset.repliesList = parentId;
                                        parentComment.appendChild(list);
                                    }
                                    const div = document.createElement('div');
                                    div.className = 'mb-3 last:mb-0 rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2 ml-4 border-l-2 border-gray-200 dark:border-gray-700';
                                    div.innerHTML = `<p class="text-sm font-medium text-gray-900 dark:text-white/90">${escapeHtml(data.comment.author)}</p><p class="text-sm text-gray-700 dark:text-gray-300">${escapeHtml(data.comment.content)}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapeHtml(data.comment.created_at)}</p>`;
                                    list.appendChild(div);
                                }
                            }
                            const countEl = document.querySelector(`[data-comment-container="${postId}"] [data-comment-count]`);
                            if (countEl) countEl.textContent = parseInt((countEl.textContent || '0').replace(/\D/g, '') || 0) + 1;
                            input.value = '';
                            replyForm?.classList.add('hidden');
                        } else if (data.error) alert(data.error);
                        resetBtn();
                    })
                    .catch(() => { alert('Something went wrong.'); resetBtn(); });
            };
            if (isAuthenticated) doSubmit();
            else showGuestModal({ type: 'comment', payload: { content }, callback: (name, email) => doSubmit(name, email) });
        }
    });

    // --- Comment submit ---
    document.querySelectorAll('[data-comment-submit]').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.dataset.postId);
            const input = document.querySelector(`[data-comment-input="${postId}"]`);
            const content = input?.value?.trim();
            if (!content) return;
            if (this.disabled) return;
            this.disabled = true;
            const origText = this.textContent;
            this.textContent = 'Posting...';
            const resetBtn = () => { this.disabled = false; this.textContent = origText; };
            const doSubmit = (guestName, guestEmail) => {
                const body = { content };
                if (guestName) body.guest_name = guestName;
                if (guestEmail) body.guest_email = guestEmail;
                fetch(`${baseUrl}/posts/${postId}/comments`, fetchOpts('POST', body))
                    .then(r => r.json())
                    .then(data => {
                        if (data.success && data.comment) {
                            const list = document.querySelector(`[data-comments-list="${postId}"]`);
                            const empty = document.querySelector(`[data-comments-empty="${postId}"]`);
                            if (list) {
                                const div = document.createElement('div');
                                div.className = 'mb-3 last:mb-0 rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2';
                                div.innerHTML = `
                                    <p class="text-sm font-medium text-gray-900 dark:text-white/90">${escapeHtml(data.comment.author)}</p>
                                    <p class="text-sm text-gray-700 dark:text-gray-300">${escapeHtml(data.comment.content)}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapeHtml(data.comment.created_at)}</p>
                                `;
                                list.appendChild(div);
                            }
                            if (empty) empty.classList.add('hidden');
                            const countEl = document.querySelector(`[data-comment-container="${postId}"] [data-comment-count]`);
                            if (countEl) countEl.textContent = parseInt((countEl.textContent || '0').replace(/\D/g, '') || 0) + 1;
                            input.value = '';
                        } else if (data.error) alert(data.error);
                        resetBtn();
                    })
                    .catch(() => { alert('Something went wrong.'); resetBtn(); });
            };
            if (isAuthenticated) doSubmit();
            else showGuestModal({ type: 'comment', payload: { content }, callback: (name, email) => doSubmit(name, email) });
        });
    });

    function escapeHtml(s) {
        if (!s) return '';
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function formatTimeAgo(date) {
        const seconds = Math.floor((Date.now() - date) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' minute' + (seconds >= 120 ? 's' : '') + ' ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' hour' + (seconds >= 7200 ? 's' : '') + ' ago';
        if (seconds < 2592000) return Math.floor(seconds / 86400) + ' day' + (seconds >= 172800 ? 's' : '') + ' ago';
        if (seconds < 31536000) return Math.floor(seconds / 2592000) + ' month' + (seconds >= 5184000 ? 's' : '') + ' ago';
        return Math.floor(seconds / 31536000) + ' year' + (seconds >= 63072000 ? 's' : '') + ' ago';
    }

    function updateTimeAgoElements() {
        document.querySelectorAll('.time-ago[data-created-at]').forEach(el => {
            const iso = el.dataset.createdAt;
            if (iso) {
                const date = new Date(iso);
                if (!isNaN(date)) el.textContent = formatTimeAgo(date);
            }
        });
    }
    updateTimeAgoElements();
    setInterval(updateTimeAgoElements, 60000);

    // --- Scroll to tribute or chapter on deep link load ---
    if (scrollToTributeId) {
        switchToTab('tributes');
        setTimeout(() => {
            const el = document.getElementById('tribute-' + scrollToTributeId);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    } else if (scrollToChapterId) {
        switchToTab('life');
        setTimeout(() => {
            const el = document.getElementById('chapter-' + scrollToChapterId);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    }

    // --- Social share (with tracking) ---
    function getShareUrl(btn) {
        if (btn.dataset.shareUrl) return btn.dataset.shareUrl;
        const base = window.location.origin + window.location.pathname;
        return btn.dataset.postId ? `${base}#post-${btn.dataset.postId}` : base;
    }
    function getShareType(btn) {
        const t = btn.dataset.share;
        return ['whatsapp', 'facebook', 'linkedin', 'copy', 'invite'].includes(t) ? t : 'invite';
    }
    function applyStats(stats) {
        const map = {
            'data-stats-views-today': stats.views_today,
            'data-stats-views-week': stats.views_last_week,
            'data-stats-views-all': stats.views_all_time,
            'data-stats-shares-today': stats.shares_today,
            'data-stats-shares-week': stats.shares_last_week,
            'data-stats-shares-all': stats.shares_all_time,
        };
        for (const [attr, val] of Object.entries(map)) {
            const el = document.querySelector(`[${attr}]`);
            if (el) el.textContent = val;
        }
    }

    function trackShare(shareType) {
        fetch(`${baseUrl}/track-share`, fetchOpts('POST', { share_type: shareType }))
            .then(r => r.json())
            .then(data => { if (data.stats) applyStats(data.stats); })
            .catch(() => {});
    }
    document.querySelectorAll('[data-share]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = getShareUrl(btn);
            const encoded = encodeURIComponent(url);
            const title = encodeURIComponent(document.title || 'Memorial');
            const shareType = getShareType(btn);
            trackShare(shareType);
            switch (shareType) {
                case 'whatsapp':
                    window.open(`https://wa.me/?text=${title}%20${encoded}`, '_blank', 'noopener');
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank', 'noopener');
                    break;
                case 'linkedin':
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, '_blank', 'noopener');
                    break;
                case 'copy':
                    navigator.clipboard.writeText(url).then(() => {
                        const orig = btn.textContent;
                        btn.textContent = 'Copied';
                        setTimeout(() => { btn.textContent = orig; }, 1500);
                    });
                    break;
            }
            document.querySelectorAll('[data-share-dropdown], [data-share-dropdown-tribute]').forEach(d => d.classList.add('hidden'));
        });
    });

    // Refresh stats shortly after load so the view the visitor just caused is reflected
    setTimeout(() => {
        fetch(`${baseUrl}/stats`, { headers: { 'Accept': 'application/json' } })
            .then(r => r.json())
            .then(applyStats)
            .catch(() => {});
    }, 1500);
});
