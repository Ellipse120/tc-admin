// 模拟用户数据
export const mockUsers = () => useState('MockUser', () => {
  return [
    { id: '1', name: '张老师', role: 'teacher', email: 'teacher@example.com' },
    { id: '2', name: '李小明', role: 'student', email: 'student1@example.com' },
    { id: '3', name: '王小红', role: 'student', email: 'student2@example.com' },
    { id: '4', name: '刘小华', role: 'student', email: 'student3@example.com' }
  ]
})

// 模拟学习资料
export const mockLearningMaterials = useState('mockLearningMaterials', () => {
  return [
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
  ]
})

// 模拟学习记录
export const mockStudyRecords = () => useState('MockStudyRecords', () => {
  return [
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
  ]
})

// 模拟学生进度
export const mockStudentProgress = () => useState('MockStudentProgress', () => {
  return [
    {
      studentId: '2',
      totalStudied: 25,
      correctAnswers: 18,
      currentStreak: 3,
      lastStudyDate: '2024-01-17',
      level: 'Intermediate'
    },
    {
      studentId: '3',
      totalStudied: 15,
      correctAnswers: 12,
      currentStreak: 1,
      lastStudyDate: '2024-01-17',
      level: 'Beginner'
    },
    {
      studentId: '4',
      totalStudied: 8,
      correctAnswers: 6,
      currentStreak: 0,
      lastStudyDate: '2024-01-16',
      level: 'Beginner'
    }
  ]
})
