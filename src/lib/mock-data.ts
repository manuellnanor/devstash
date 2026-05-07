// Mock data for dashboard UI development
// Uses the same structure as Prisma schema (User, ItemType, Item, Collection, Tag)

export const mockUser = {
  id: "user_1",
  name: "Manuell Nanor",
  email: "mannynanor@gmail.com.com",
  image:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f5",
  isPro: false,
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-05-07"),
};

export const mockItemTypes = [
  {
    id: "type_snippet",
    name: "snippet",
    icon: "Code",
    color: "#3b82f6",
    isSystem: true,
  },
  {
    id: "type_prompt",
    name: "prompt",
    icon: "Sparkles",
    color: "#8b5cf6",
    isSystem: true,
  },
  {
    id: "type_command",
    name: "command",
    icon: "Terminal",
    color: "#f97316",
    isSystem: true,
  },
  {
    id: "type_note",
    name: "note",
    icon: "StickyNote",
    color: "#fde047",
    isSystem: true,
  },
  {
    id: "type_file",
    name: "file",
    icon: "File",
    color: "#6b7280",
    isSystem: true,
  },
  {
    id: "type_image",
    name: "image",
    icon: "ImageIcon",
    color: "#ec4899",
    isSystem: true,
  },
  {
    id: "type_link",
    name: "link",
    icon: "Link",
    color: "#10b981",
    isSystem: true,
  },
];

export const mockCollections = [
  {
    id: "col_1",
    name: "React Patterns",
    description: "Reusable React component patterns and snippets",
    isFavorite: true,
    defaultTypeId: "type_snippet",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-05-01"),
  },
  {
    id: "col_2",
    name: "AI Prompts",
    description: "System prompts and custom instructions for various AI tasks",
    isFavorite: true,
    defaultTypeId: "type_prompt",
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-04-20"),
  },
  {
    id: "col_3",
    name: "Terminal Commands",
    description: "Useful CLI commands and Git workflows",
    isFavorite: false,
    defaultTypeId: "type_command",
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-05-03"),
  },
  {
    id: "col_4",
    name: "Resources & Links",
    description: "Bookmarked articles, docs, and references",
    isFavorite: false,
    defaultTypeId: "type_link",
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-05-05"),
  },
];

export const mockItems = [
  {
    id: "item_1",
    title: "Custom Hook: useLocalStorage",
    description: "Persist component state to localStorage with sync across tabs",
    contentType: "TEXT" as const,
    content: `function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value: any) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}`,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    lastUsedAt: new Date("2025-05-06"),
    createdAt: new Date("2025-02-20"),
    updatedAt: new Date("2025-04-15"),
    itemTypeId: "type_snippet",
  },
  {
    id: "item_2",
    title: "Efficient React Re-render Pattern",
    description:
      "Minimize unnecessary re-renders using React.memo and useCallback",
    contentType: "TEXT" as const,
    content: `Use React.memo to prevent re-renders when props haven't changed.
Use useCallback to memoize functions passed as props.
Use useMemo to memoize expensive computations.
Consider using Suspense for code splitting and lazy loading.`,
    language: "javascript",
    isFavorite: true,
    isPinned: false,
    lastUsedAt: new Date("2025-05-04"),
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-05-04"),
    itemTypeId: "type_snippet",
  },
  {
    id: "item_3",
    title: "System Prompt: Code Reviewer",
    description: "Specialized prompt for AI code review and quality analysis",
    contentType: "TEXT" as const,
    content: `You are an expert code reviewer. Review the provided code for:
1. Performance optimizations
2. Security vulnerabilities
3. Code style and readability
4. Best practices for the language
5. Potential bugs or edge cases

Be constructive and provide specific suggestions for improvement.`,
    language: "text",
    isFavorite: false,
    isPinned: true,
    lastUsedAt: new Date("2025-05-07"),
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-05-07"),
    itemTypeId: "type_prompt",
  },
  {
    id: "item_4",
    title: "System Prompt: Test Writer",
    description: "Prompt for generating comprehensive test cases",
    contentType: "TEXT" as const,
    content: `You are a QA expert specializing in test case generation.
Given a function or feature, generate comprehensive test cases covering:
- Happy path scenarios
- Edge cases
- Error conditions
- Boundary conditions

Use the following format:
Test Case: [name]
Input: [input]
Expected Output: [expected]
Status: [pass/fail]`,
    language: "text",
    isFavorite: true,
    isPinned: false,
    lastUsedAt: new Date("2025-05-02"),
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-05-02"),
    itemTypeId: "type_prompt",
  },
  {
    id: "item_5",
    title: "Git Clean Local Branches",
    description: "Remove all local branches that have been deleted upstream",
    contentType: "TEXT" as const,
    content: `git fetch -p && git branch -vv | grep gone | awk '{print $1}' | xargs git branch -d`,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: new Date("2025-05-05"),
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-05-05"),
    itemTypeId: "type_command",
  },
  {
    id: "item_6",
    title: "Docker Build & Push",
    description: "Build Docker image and push to registry",
    contentType: "TEXT" as const,
    content: `docker build -t myapp:latest .
docker tag myapp:latest registry.example.com/myapp:latest
docker push registry.example.com/myapp:latest`,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: new Date("2025-04-28"),
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-28"),
    itemTypeId: "type_command",
  },
  {
    id: "item_7",
    title: "State Management Ideas",
    description: "Thoughts on choosing between Redux, Zustand, and Context",
    contentType: "TEXT" as const,
    content: `Redux: Complex apps with lots of state and middleware
Zustand: Lightweight, simple API, great for medium complexity
Context: Small to medium apps, avoid prop drilling
Recoil: Atom-based, experimental, good for async state

Consider: Team expertise, bundle size, learning curve`,
    language: "text",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: new Date("2025-05-01"),
    createdAt: new Date("2025-03-22"),
    updatedAt: new Date("2025-05-01"),
    itemTypeId: "type_note",
  },
  {
    id: "item_8",
    title: "Performance Optimization Checklist",
    description: "Quick reference for web performance improvements",
    contentType: "TEXT" as const,
    content: `□ Enable gzip compression
□ Minimize CSS/JS bundles
□ Lazy load images and components
□ Use CDN for static assets
□ Cache aggressively
□ Optimize Core Web Vitals
□ Use HTTP/2 or HTTP/3
□ Database query optimization
□ Connection pooling
□ Monitoring and profiling`,
    language: "text",
    isFavorite: true,
    isPinned: false,
    lastUsedAt: new Date("2025-04-30"),
    createdAt: new Date("2025-02-28"),
    updatedAt: new Date("2025-04-30"),
    itemTypeId: "type_note",
  },
  {
    id: "item_9",
    title: "Next.js Documentation",
    description: "Official Next.js documentation and API reference",
    contentType: "TEXT" as const,
    url: "https://nextjs.org/docs",
    isFavorite: true,
    isPinned: false,
    lastUsedAt: new Date("2025-05-06"),
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-05-06"),
    itemTypeId: "type_link",
  },
  {
    id: "item_10",
    title: "Tailwind CSS Reference",
    description: "Complete Tailwind utility classes and setup guide",
    contentType: "TEXT" as const,
    url: "https://tailwindcss.com/docs",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: new Date("2025-04-25"),
    createdAt: new Date("2025-02-05"),
    updatedAt: new Date("2025-04-25"),
    itemTypeId: "type_link",
  },
  {
    id: "item_11",
    title: "TypeScript Handbook",
    description: "Comprehensive TypeScript language reference",
    contentType: "TEXT" as const,
    url: "https://www.typescriptlang.org/docs/",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: new Date("2025-05-01"),
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-05-01"),
    itemTypeId: "type_link",
  },
];

export const mockTags = [
  { id: "tag_1", name: "react" },
  { id: "tag_2", name: "typescript" },
  { id: "tag_3", name: "performance" },
  { id: "tag_4", name: "hooks" },
  { id: "tag_5", name: "git" },
  { id: "tag_6", name: "ai-prompts" },
  { id: "tag_7", name: "documentation" },
  { id: "tag_8", name: "useful" },
];

// Item-to-Collection relationships
export const mockItemCollections = [
  { itemId: "item_1", collectionId: "col_1" },
  { itemId: "item_2", collectionId: "col_1" },
  { itemId: "item_3", collectionId: "col_2" },
  { itemId: "item_4", collectionId: "col_2" },
  { itemId: "item_5", collectionId: "col_3" },
  { itemId: "item_6", collectionId: "col_3" },
  { itemId: "item_9", collectionId: "col_4" },
  { itemId: "item_10", collectionId: "col_4" },
  { itemId: "item_11", collectionId: "col_4" },
];

// Item-to-Tag relationships
export const mockItemTags = [
  { itemId: "item_1", tagId: "tag_1" },
  { itemId: "item_1", tagId: "tag_2" },
  { itemId: "item_1", tagId: "tag_4" },
  { itemId: "item_2", tagId: "tag_1" },
  { itemId: "item_2", tagId: "tag_3" },
  { itemId: "item_3", tagId: "tag_6" },
  { itemId: "item_4", tagId: "tag_6" },
  { itemId: "item_5", tagId: "tag_5" },
  { itemId: "item_7", tagId: "tag_1" },
  { itemId: "item_8", tagId: "tag_3" },
  { itemId: "item_9", tagId: "tag_7" },
  { itemId: "item_10", tagId: "tag_7" },
  { itemId: "item_11", tagId: "tag_7" },
  { itemId: "item_11", tagId: "tag_2" },
];
