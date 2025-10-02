# TODO Kanban Web App

A modern, beautifully designed Kanban board application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- 📋 **Multiple Projects** - Create and manage unlimited projects
- 🎯 **Drag & Drop** - Intuitive drag and drop for tasks and columns
- 🏷️ **Task Types** - Color-coded task categories (Front-End, Back-end, Design, Testing)
- 📊 **Custom Workflow** - Fully customizable status columns/states
- 🎨 **Beautiful Themes** - 5 stunning themes (Light, Dark, Ocean Blue, Purple Dream, Forest Green)
- 📎 **File Attachments** - Upload and preview images, PDFs, and documents
- 🔍 **Advanced Filtering** - Search and filter by type, priority, and keywords
- ⚙️ **Comprehensive Settings** - Dedicated settings page with real-time updates
- 🎭 **Smooth Animations** - Polished UI with customizable animations
- 💾 **Auto-save** - All changes saved automatically to localStorage
- 🔔 **Smart Notifications** - Beautiful toast notifications for all actions
- 🎛️ **Appearance Controls** - Font size, compact mode, and animation toggles

## 🏗️ Architecture

Clean, modular architecture with componentization:

```
src/
├── components/
│   ├── settings/              # Settings sub-components
│   │   ├── ThemeSelector.tsx
│   │   ├── TaskTypeManager.tsx
│   │   └── PriorityManager.tsx
│   ├── ConfirmModal.tsx
│   ├── ColumnModal.tsx
│   ├── KanbanColumn.tsx
│   ├── NewProjectModal.tsx
│   ├── ProjectSelector.tsx
│   ├── TaskCard.tsx
│   └── TaskModal.tsx
├── pages/                     # Full-page views
│   ├── KanbanBoard.tsx
│   └── SettingsPage.tsx
├── contexts/                  # React Context providers
│   ├── ProjectContext.tsx
│   ├── SettingsContext.tsx
│   └── ToastContext.tsx
├── hooks/                     # Custom React hooks
│   ├── useColumns.ts
│   └── useTasks.ts
├── services/                  # Business logic
│   └── storage.ts
├── utils/                     # Helpers & utilities
│   ├── helpers.ts
│   └── themes.ts
└── assets/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd TODO-web
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Key Features Explained

### Kanban Board Workflow

**Custom Workflow States**:

- Default states: TODO, In Progress, In Review, Completed
- Add custom states directly from the board or settings
- Drag columns to reorder your workflow
- Click "+ Add new state" to create new workflow steps

### Task Types with Visual Identity

Each task type has a distinctive color band at the top:

- 🔵 **Front-End** - Blue (#3B82F6)
- 🟠 **Back-end** - Orange (#F59E0B)
- 💗 **Design** - Pink (#EC4899)
- 🟢 **Testing** - Green (#10B981)

### Modern Task Cards

```
┌─────────────────────────┐
│ ▓▓▓▓▓ (Type Color Band) │
├─────────────────────────┤
│ [Type Badge]            │
│                         │
│ Title Here              │
│                         │
│ Description text...     │
│                         │
│ 📄 3    [⬤ High]       │
└─────────────────────────┘
```

### Dedicated Settings Page

**No More Modals!** Settings now has its own full-page interface with:

**Appearance Section**:

- 🎨 Theme selector with 5 beautiful themes
- 📏 Font size control (Small, Medium, Large)
- 📐 Compact mode for more content
- ✨ Animation toggle

**Task Configuration**:

- 🏷️ **Task Types**: Click to set default, visual grid layout
- 📊 **Priorities**: Click to set default, add/delete custom priorities
- All changes save automatically - no save button needed!

**General Settings**:

- 💾 Auto-save toggle
- More settings to come!

### Themes

**5 Beautiful Themes**:

1. **Light** - Clean and bright
2. **Dark** - Easy on the eyes
3. **Ocean Blue** - Calm and professional
4. **Purple Dream** - Creative and vibrant
5. **Forest Green** - Natural and refreshing

### Smart Confirmation Dialogs

Custom confirmation modals replace JavaScript alerts:

- Beautiful design matching your theme
- Clear messaging
- Color-coded by severity (danger, warning, info)

## 🎨 Customization

### Adding Custom Task Types

In Settings → Task Configuration → Task Types:

1. Click "+ Add Type"
2. Enter the type name
3. It's automatically available!

### Managing Priorities

In Settings → Task Configuration → Priorities:

1. Click any priority badge to set as default
2. Click "+ Add Priority" to create new ones
3. Hover over non-default priorities to delete them

### Creating Workflow States

**From Board**:

- Click "+ Add new state"
- Enter name and choose color

**From Settings** (future):

- Manage default states for new projects

## 🔧 Technical Details

### State Management

- **Context API**: Global state (Projects, Settings, Toasts)
- **Custom Hooks**: Data operations (useColumns, useTasks)
- **Local State**: UI interactions
- **Real-time Updates**: All changes save automatically

### Data Persistence

Everything stored in localStorage:

- Projects with unique IDs
- Columns per project (fully customizable)
- Tasks with types and priorities
- Settings with themes and preferences
- File attachments (base64 encoded)

### Styling

- **Tailwind CSS**: Utility-first styling
- **CSS Variables**: Dynamic theme system
- **Custom Animations**: Smooth transitions
- **Responsive Design**: Mobile-first approach

## 📱 Responsive Design

Fully responsive across all devices:

- 🖥️ Desktop (1920px+)
- 💻 Laptop (1366px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## ⚡ Performance Features

- **Auto-save**: No manual saving needed
- **Lazy Loading**: Components load as needed
- **Optimized Re-renders**: React Context prevents unnecessary updates
- **Local Storage**: Fast data access
- **Animation Control**: Disable animations for better performance

## 🎯 User Experience

### Instant Feedback

- ✅ Success toasts for completed actions
- ❌ Error toasts for invalid operations
- ℹ️ Info toasts for state changes
- ⚠️ Warning confirmations for destructive actions

### Intuitive Controls

- Click task types/priorities to select default
- Hover for contextual actions
- Drag to reorder
- Keyboard shortcuts (ESC to close modals)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with modern technologies:

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build Tool
- [Lucide Icons](https://lucide.dev/) - Icon Library

---

Made with ❤️ for better project management and productivity
