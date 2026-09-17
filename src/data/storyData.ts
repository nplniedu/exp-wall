export interface StoryChapter {
  id: number;
  title: string;
  image: string;
  contentFile: string;
}

export const storyChapters: StoryChapter[] = [
  { id: 1, title: '第一章：深海诞生', image: '/images/story/1.png', contentFile: '/content/1.md' },
  { id: 2, title: '第二章：女仆装的秘密', image: '/images/story/2.png', contentFile: '/content/2.md' },
  { id: 3, title: '第三章：泡泡与问号', image: '/images/story/3.png', contentFile: '/content/3.md' },
  { id: 4, title: '第四章：第一次上岸', image: '/images/story/4.png', contentFile: '/content/4.md' },
  { id: 5, title: '第五章：表情包大师', image: '/images/story/5.png', contentFile: '/content/5.md' },
  { id: 6, title: '第六章：干饭时间', image: '/images/story/6.png', contentFile: '/content/6.md' },
  { id: 7, title: '第七章：冒险与成长', image: '/images/story/7.png', contentFile: '/content/7.md' },
  { id: 8, title: '第八章：英雄之家', image: '/images/story/8.png', contentFile: '/content/8.md' },
];

// 生成21张跑马灯图片（8章循环）
export const marqueeImages: StoryChapter[] = Array.from({ length: 21 }, (_, i) => {
  const chapter = storyChapters[i % storyChapters.length];
  return { ...chapter, id: i + 1 };
});
