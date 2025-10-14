export default defineAppConfig({
  appInfo: {
    adminTitle: '英语AI学习系统管理后台',
    title: '英语AI学习系统',
    roleEnum: {
      Teacher: 0,
      Assistant: 1,
      Student: 2,
      Admin: 3
    },
    roleItems: [
      {
        label: '教师',
        value: 'teacher'
      },
      {
        label: '助教',
        value: 'assistant'
      },
      {
        label: '管理员',
        value: 'admin'
      },
      {
        label: '学生',
        value: 'student'
      }
    ]
  },
  mockData: {
    // 模拟用户数据
    mockUsers: [
      { id: '1', name: '张老师', role: 'teacher', email: 'teacher@example.com' },
      { id: '2', name: '李小明', role: 'student', email: 'student1@example.com' },
      { id: '3', name: '王小红', role: 'student', email: 'student2@example.com' },
      { id: '4', name: '刘小华', role: 'student', email: 'student3@example.com' }
    ],
    // 模拟学习资料
    mockLearningMaterials: [
      {
        id: '1',
        type: 'word',
        content: 'apple',
        translation: '苹果',
        difficulty: 'beginner',
        createdBy: '1',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        type: 'word',
        content: 'beautiful',
        translation: '美丽的',
        difficulty: 'intermediate',
        createdBy: '1',
        createdAt: '2024-01-15'
      },
      {
        id: '3',
        type: 'sentence',
        content: 'How are you today?',
        translation: '你今天怎么样？',
        difficulty: 'beginner',
        createdBy: '1',
        createdAt: '2024-01-16'
      },
      {
        id: '4',
        type: 'word',
        content: 'challenge',
        translation: '挑战',
        difficulty: 'advanced',
        createdBy: '1',
        createdAt: '2024-01-16'
      }
    ],
    // 模拟学习记录
    mockStudyRecords: [
      {
        id: '1',
        studentId: '2',
        materialId: '1',
        studiedAt: '2024-01-17T10:30:00Z',
        correct: true,
        timeSpent: 45
      },
      {
        id: '2',
        studentId: '2',
        materialId: '2',
        studiedAt: '2024-01-17T10:35:00Z',
        correct: false,
        timeSpent: 60
      },
      {
        id: '3',
        studentId: '3',
        materialId: '1',
        studiedAt: '2024-01-17T14:20:00Z',
        correct: true,
        timeSpent: 30
      }
    ],
    // 模拟学生进度
    mockStudentProgress: [
      {
        studentId: '2',
        totalStudied: 25,
        correctAnswers: 18,
        currentStreak: 3,
        lastStudyDate: '2024-01-17',
        level: 'intermediate'
      },
      {
        studentId: '3',
        totalStudied: 15,
        correctAnswers: 12,
        currentStreak: 1,
        lastStudyDate: '2024-01-17',
        level: 'beginner'
      },
      {
        studentId: '4',
        totalStudied: 8,
        correctAnswers: 6,
        currentStreak: 0,
        lastStudyDate: '2024-01-16',
        level: 'beginner'
      }
    ]
  },
  ui: {
    colors: {
      primary: 'red',
      neutral: 'slate'
    },
    main: {
      base: 'min-h-[calc(100vh-var(--ui-header-height))] p-8 bg-slate-50'
    },
    modal: {
      slots: {
        overlay: 'bg-black/20',
        footer: 'justify-center'
      }
    },
    input: {
      slots: {
        root: 'w-full'
      }
    },
    select: {
      slots: {
        base: 'w-full'
      }
    },
    card: {
      slots: {
        header: 'border-b-0'
      }
    },
    button: {
      variants: {
        color: {
          ghost: 'bg-transparent border border-gray-200 hover:bg-slate-100 text-slate-700'
        }
      }
    },
    badge: {
      variants: {
        color: {
          ghost: 'bg-transparent text-gray-800 border border-gray-200'
        }
      }
    }
  }
})
