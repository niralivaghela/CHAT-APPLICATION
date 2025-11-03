const socket = io();

// DOM Elements
const usernameModal = document.getElementById('usernameModal');
const usernameInput = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');
const userCount = document.getElementById('userCount');
const onlineCount = document.getElementById('onlineCount');
const currentUser = document.getElementById('currentUser');
const usersList = document.getElementById('usersList');

// Feature elements
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
const attachBtn = document.getElementById('attachBtn');
const fileInput = document.getElementById('fileInput');
const profileBtn = document.getElementById('profileBtn');
const themeToggle = document.getElementById('themeToggle');
const soundToggle = document.getElementById('soundToggle');

let username = '';
let userAvatar = '👤';
let userStatus = 'Online';
let currentTheme = 'light';
let soundEnabled = true;
let typingTimer;
let onlineUsers = new Set();
let allMessages = [];

// Expanded Emoji categories with many more emojis
const emojiCategories = {
    recent: ['😀', '😂', '😍', '🤔', '😎', '😢', '😡', '👍', '❤️', '🔥', '💯', '✨', '🎉', '👏', '🙌', '💪', '🤝', '🙏', '💖', '😘', '🥳', '🤩', '😋', '🤗'],
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
    people: ['👤', '👥', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️', '🧕', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '💂‍♀️', '💂', '💂‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍🏭', '🧑‍🏭', '👨‍🏭', '👩‍💻', '🧑‍💻', '👨‍💻', '👩‍💼', '🧑‍💼', '👨‍💼', '👩‍🔧', '🧑‍🔧', '👨‍🔧', '👩‍🔬', '🧑‍🔬', '👨‍🔬', '👩‍🎨', '🧑‍🎨', '👨‍🎨', '👩‍🚒', '🧑‍🚒', '👨‍🚒', '👩‍✈️', '🧑‍✈️', '👨‍✈️', '👩‍🚀', '🧑‍🚀', '👨‍🚀', '👩‍⚖️', '🧑‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🦸‍♀️', '🦸', '🦸‍♂️', '🦹‍♀️', '🦹', '🦹‍♂️', '🤶', '🎅', '🧙‍♀️', '🧙', '🧙‍♂️', '🧝‍♀️', '🧝', '🧝‍♂️', '🧛‍♀️', '🧛', '🧛‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🧞‍♀️', '🧞', '🧞‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️'],
    nature: ['🌿', '🌱', '🌳', '🌲', '🌴', '🌵', '🌾', '🌻', '🌺', '🌸', '🌼', '🌷', '🥀', '🌹', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌊', '💧', '💦', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌛', '🌜', '☀️', '⭐', '🌟', '💫', '✨', '☄️', '🌠', '🔥', '💥', '⚡', '🌈', '🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    food: ['🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥗', '🍿', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌶️', '🥕', '🧄', '🧅', '🍄', '🥬', '🥒', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌶️', '🥕', '🧄', '🧅', '🍄', '🥬', '🥒', '🥖', '🥨', '🥯', '🧀', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌶️', '🥕', '🧄', '🧅', '🍄', '🥬', '🥒', '🥖', '🥨', '🥯', '🧀', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌶️', '🥕', '🧄', '🧅', '🍄', '🥬', '🥒', '🥖', '🥨', '🥯', '🧀', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🧃', '🥤', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧉', '🧊'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹‍♀️', '🤹', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🪘', '🎹', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴', '🎯', '🎳'],
    objects: ['💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧴', '🧷', '🧸', '🧵', '🪡', '🧶', '🪢', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩴', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞️', '📹', '📷', '📸', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⏳', '⌛', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲']
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showUsernameModal();
    initializeFeatures();
    loadUserPreferences();
    populateEmojiPicker();
});

function initializeFeatures() {
    // Search functionality
    if (searchBtn) searchBtn.addEventListener('click', showSearchModal);
    if (clearBtn) clearBtn.addEventListener('click', clearChat);
    
    // Profile settings
    if (profileBtn) profileBtn.addEventListener('click', showProfileModal);
    
    // Theme and sound
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (soundToggle) soundToggle.addEventListener('click', toggleSound);
    
    // Emoji picker
    if (emojiBtn) {
        emojiBtn.addEventListener('click', toggleEmojiPicker);
        document.addEventListener('click', (e) => {
            if (emojiPicker && !emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
                emojiPicker.style.display = 'none';
            }
        });
    }
    
    // File attachment
    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Auto-resize textarea
    if (messageInput) {
        messageInput.addEventListener('input', autoResizeTextarea);
    }
}

function populateEmojiPicker() {
    const emojiGrid = document.getElementById('emojiGrid');
    if (!emojiGrid) return;
    
    // Show recent emojis by default
    showEmojiCategory('recent');
}

function showEmojiCategory(category) {
    const emojiGrid = document.getElementById('emojiGrid');
    if (!emojiGrid || !emojiCategories[category]) return;
    
    emojiGrid.innerHTML = '';
    emojiCategories[category].forEach(emoji => {
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'emoji';
        emojiSpan.textContent = emoji;
        emojiSpan.addEventListener('click', () => insertEmoji(emoji));
        emojiGrid.appendChild(emojiSpan);
    });
}

function loadUserPreferences() {
    const savedTheme = localStorage.getItem('chatTheme') || 'light';
    const savedSound = localStorage.getItem('chatSound') !== 'false';
    const savedAvatar = localStorage.getItem('chatAvatar') || '👤';
    const savedStatus = localStorage.getItem('chatStatus') || 'Online';
    
    currentTheme = savedTheme;
    soundEnabled = savedSound;
    userAvatar = savedAvatar;
    userStatus = savedStatus;
    
    document.body.setAttribute('data-theme', currentTheme);
    
    const userAvatarEl = document.getElementById('userAvatar');
    const statusTextEl = document.getElementById('statusText');
    
    if (userAvatarEl) userAvatarEl.textContent = userAvatar;
    if (statusTextEl) statusTextEl.textContent = userStatus;
    
    if (!soundEnabled && soundToggle) {
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Username Modal Functions
function showUsernameModal() {
    if (usernameModal) {
        usernameModal.style.display = 'flex';
        if (usernameInput) usernameInput.focus();
    }
}

function hideUsernameModal() {
    if (usernameModal) {
        usernameModal.style.display = 'none';
    }
}

// Join Chat
if (joinBtn) joinBtn.addEventListener('click', joinChat);
if (usernameInput) {
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinChat();
    });
}

function joinChat() {
    const name = usernameInput ? usernameInput.value.trim() : '';
    if (name.length < 2) {
        alert('Username must be at least 2 characters long');
        return;
    }
    
    username = name;
    if (currentUser) currentUser.textContent = username;
    
    socket.emit('newUser', { 
        username, 
        avatar: userAvatar, 
        status: userStatus 
    });
    
    hideUsernameModal();
    enableChat();
    playSound('joinSound');
}

function enableChat() {
    if (messageInput) messageInput.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    if (messageInput) messageInput.focus();
}

// Message Functions
if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        } else {
            handleTyping();
        }
    });
}

function sendMessage() {
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chatMessage', { text: message });
        messageInput.value = '';
        messageInput.style.height = 'auto';
        clearTimeout(typingTimer);
    }
}

function handleTyping() {
    socket.emit('typing');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('stopTyping');
    }, 2000);
}

function autoResizeTextarea() {
    if (!messageInput) return;
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Theme and Sound Functions
function toggleTheme() {
    const themes = ['light', 'dark', 'purple'];
    const currentIndex = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIndex + 1) % themes.length];
    
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('chatTheme', currentTheme);
    
    if (themeToggle) {
        const icons = ['fa-sun', 'fa-moon', 'fa-star'];
        themeToggle.innerHTML = `<i class="fas ${icons[themes.indexOf(currentTheme)]}"></i>`;
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('chatSound', soundEnabled);
    
    if (soundToggle) {
        soundToggle.innerHTML = soundEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
    }
}

function playSound(soundId) {
    if (soundEnabled) {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }
}

// Modal Functions
function showSearchModal() {
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        searchModal.style.display = 'flex';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
}

function showProfileModal() {
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.style.display = 'flex';
    }
}

function clearChat() {
    if (confirm('Are you sure you want to clear all messages?')) {
        if (messagesContainer) messagesContainer.innerHTML = '';
        allMessages = [];
    }
}

// Emoji Functions
function toggleEmojiPicker() {
    if (!emojiPicker) return;
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
}

function insertEmoji(emoji) {
    if (!messageInput) return;
    
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.focus();
    messageInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    
    if (emojiPicker) emojiPicker.style.display = 'none';
    autoResizeTextarea();
}

// File Upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const fileData = {
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            data: e.target.result
        };
        socket.emit('fileMessage', fileData);
    };
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Display Functions
function displayMessage(data, isOwn = false) {
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'own' : ''}`;
    messageDiv.dataset.messageId = data.id || Date.now();
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    messageHeader.innerHTML = `
        <span class="username">${data.user}</span>
        <span class="timestamp">${data.time}</span>
    `;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (data.file) {
        messageContent.appendChild(createFileAttachment(data.file));
    } else if (data.voice) {
        messageContent.appendChild(createVoiceMessage(data.voice));
    } else if (data.gif) {
        messageContent.appendChild(createGifMessage(data.gif));
    } else {
        messageContent.textContent = data.text || '';
    }
    
    const messageActions = document.createElement('div');
    messageActions.className = 'message-actions';
    messageActions.innerHTML = `
        <button class="message-action" onclick="addReaction('${messageDiv.dataset.messageId}', '👍')" title="Like">
            <i class="fas fa-thumbs-up"></i>
        </button>
        <button class="message-action" onclick="addReaction('${messageDiv.dataset.messageId}', '❤️')" title="Love">
            <i class="fas fa-heart"></i>
        </button>
        <button class="message-action" onclick="copyMessage('${(data.text || '').replace(/'/g, "\\'")}'))" title="Copy">
            <i class="fas fa-copy"></i>
        </button>
    `;
    
    const reactionsDiv = document.createElement('div');
    reactionsDiv.className = 'message-reactions';
    reactionsDiv.id = `reactions-${messageDiv.dataset.messageId}`;
    
    messageDiv.appendChild(messageHeader);
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageActions);
    messageDiv.appendChild(reactionsDiv);
    messagesContainer.appendChild(messageDiv);
    
    allMessages.push(data);
    scrollToBottom();
    
    if (!document.hasFocus() && !isOwn) {
        showNotification(data);
        playSound('messageSound');
    }
}

function createFileAttachment(file) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-attachment';
    
    const isImage = file.type && file.type.startsWith('image/');
    
    if (isImage) {
        fileDiv.innerHTML = `
            <img src="${file.data}" alt="${file.name}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
        `;
    } else {
        fileDiv.innerHTML = `
            <div class="file-icon">
                <i class="fas fa-file"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${file.size}</div>
            </div>
            <button class="download-btn" onclick="downloadFile('${file.data}', '${file.name}')">
                <i class="fas fa-download"></i>
            </button>
        `;
    }
    
    return fileDiv;
}

function createVoiceMessage(voice) {
    const voiceDiv = document.createElement('div');
    voiceDiv.className = 'voice-message';
    voiceDiv.innerHTML = `
        <div class="voice-controls">
            <button class="play-voice" onclick="playVoiceMessage('${voice.data}')">
                <i class="fas fa-play"></i>
            </button>
            <div class="voice-duration">${voice.duration}s</div>
        </div>
    `;
    return voiceDiv;
}

function createGifMessage(gif) {
    const gifDiv = document.createElement('div');
    gifDiv.className = 'gif-message';
    gifDiv.innerHTML = `<img src="${gif.url}" alt="GIF" style="max-width: 200px; border-radius: 8px;">`;
    return gifDiv;
}

function displaySystemMessage(message) {
    if (!messagesContainer) return;
    
    const systemDiv = document.createElement('div');
    systemDiv.className = 'system-message';
    systemDiv.textContent = message;
    messagesContainer.appendChild(systemDiv);
    scrollToBottom();
}

function scrollToBottom() {
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function updateUsersList() {
    if (!usersList) return;
    
    usersList.innerHTML = '';
    onlineUsers.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = `
            <div class="status-indicator online"></div>
            <span>${user.avatar || '👤'}</span>
            <div>
                <div>${user.username || user}</div>
                <div class="last-seen">${user.status || 'Online'}</div>
            </div>
        `;
        usersList.appendChild(userDiv);
    });
    
    if (userCount) userCount.textContent = onlineUsers.size;
    if (onlineCount) onlineCount.textContent = onlineUsers.size;
}

// Utility Functions
function addReaction(messageId, emoji) {
    socket.emit('messageReaction', { messageId, emoji, user: username });
}

function copyMessage(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Message copied');
    });
}

function downloadFile(data, filename) {
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    link.click();
}

function playVoiceMessage(audioData) {
    const audio = new Audio(audioData);
    audio.play();
}

function showNotification(data) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`New message from ${data.user}`, {
            body: data.text || 'Sent a file',
            icon: '/favicon.ico'
        });
    }
}

// Socket Event Listeners
socket.on('chatHistory', (messages) => {
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    allMessages = [];
    
    if (Array.isArray(messages)) {
        messages.forEach(msg => {
            displayMessage(msg, msg.user === username);
        });
    }
});

socket.on('message', (data) => {
    displayMessage(data, data.user === username);
});

socket.on('fileMessage', (data) => {
    displayMessage(data, data.user === username);
});

socket.on('voiceMessage', (data) => {
    displayMessage(data, data.user === username);
});

socket.on('gifMessage', (data) => {
    displayMessage(data, data.user === username);
});

socket.on('userJoined', (user) => {
    onlineUsers.add(user);
    updateUsersList();
    
    const userName = user.username || user;
    if (userName !== username) {
        displaySystemMessage(`${userName} joined the chat`);
        playSound('joinSound');
    }
});

socket.on('userLeft', (user) => {
    onlineUsers.delete(user);
    updateUsersList();
    
    const userName = user.username || user;
    if (userName) {
        displaySystemMessage(`${userName} left the chat`);
    }
});

socket.on('showTyping', (user) => {
    if (user !== username) {
        const typingUsers = document.getElementById('typingUsers');
        if (typingUsers) {
            typingUsers.textContent = `${user} is typing...`;
            setTimeout(() => {
                typingUsers.textContent = '';
            }, 2000);
        }
    }
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    displaySystemMessage('Disconnected from server');
});

window.addEventListener('beforeunload', () => {
    socket.disconnect();
});