import { GoogleGenAI, Type } from "@google/genai";
import { StoryData, StoryWordItem } from "../types";
import { getPinyin } from "../utils";

// Lazy initialize client to prevent startup crash if API key is not yet set
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  if (!apiKey) return null;
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

/**
 * Built-in Preset Stories for offline & instant play
 * Each story comes with 15 tiered vocabulary words (1-5 Lv.1, 6-10 Lv.2, 11-15 Lv.3)
 */
export const PRESET_STORIES: StoryData[] = [
  {
    id: "preset_basketball",
    topic: "激战篮球总决赛",
    titleZh: "热血篮球总决赛与冠军时刻",
    titleEn: "The Basketball Championship and Golden Victory",
    storyZh: "今天阳光灿烂，小熊和精力充沛的伙伴们参加了一场盛大的篮球赛。赛场上两支球队竞争激烈。在最后一分钟，小熊送出了一记漂亮的传球，兔子高高跃起把篮球投向球框。哨声吹响，比分锁定！大家赢得了最终的胜利，成为最棒的冠军！全场观众为他们送上了最热烈的喝彩与庆祝！",
    storyEn: "On a sunny day, Little Bear and his energetic friends joined a grand basketball match. Two great teams played hard. In the final minute, Little Bear made a wonderful pass, and Bunny leaped high to throw the basketball into the hoop. The whistle blew. They won the sweet victory and became proud champions! The whole crowd gave loud cheers to celebrate this great game!",
    createdAt: Date.now() - 50000,
    words: [
      { word: "game", phonetic: "/ɡeɪm/", translation: "篮球赛", level: 1, example: "We played a fun game." },
      { word: "ball", phonetic: "/bɔːl/", translation: "篮球", level: 1, example: "Throw the ball to me." },
      { word: "team", phonetic: "/tiːm/", translation: "球队", level: 1, example: "Our team is strong." },
      { word: "pass", phonetic: "/pɑːs/", translation: "传球", level: 1, example: "Make a quick pass." },
      { word: "hoop", phonetic: "/huːp/", translation: "球框", level: 1, example: "The ball goes through the hoop." },
      { word: "victory", phonetic: "/ˈvɪktəri/", translation: "胜利", level: 2, example: "We celebrate our victory." },
      { word: "champion", phonetic: "/ˈtʃæmpiən/", translation: "冠军", level: 2, example: "They are proud champions." },
      { word: "whistle", phonetic: "/ˈwɪsl/", translation: "哨声", level: 2, example: "The referee blew the whistle." },
      { word: "cheer", phonetic: "/tʃɪə/", translation: "喝彩", level: 2, example: "Fans cheer for the team." },
      { word: "celebrate", phonetic: "/ˈselɪbreɪt/", translation: "庆祝", level: 2, example: "Let us celebrate together." },
      { word: "energetic", phonetic: "/ˌenəˈdʒetɪk/", translation: "精力充沛的", level: 3, example: "He is an energetic player." },
      { word: "basketball", phonetic: "/ˈbɑːskɪtbɔːl/", translation: "篮球", level: 3, example: "I love basketball." },
      { word: "wonderful", phonetic: "/ˈwʌndəfl/", translation: "漂亮的", level: 3, example: "What a wonderful play!" },
      { word: "audience", phonetic: "/ˈɔːdiəns/", translation: "观众", level: 3, example: "The audience clapped happily." },
      { word: "determination", phonetic: "/dɪˌtɜːmɪˈneɪʃn/", translation: "毅力", level: 3, example: "Victory comes from determination." }
    ]
  },
  {
    id: "preset_ultraman",
    topic: "奥特曼打怪兽",
    titleZh: "光之巨人与水晶小怪兽",
    titleEn: "The Giant of Light and Crystal Monster",
    storyZh: "在一颗美丽的蓝色星球上，突然出现了一只由闪亮水晶组成的小怪兽。小怪兽肚子很饿，正在四处寻找发光的能量石。奥特曼带着温暖的光芒飞来了。他没有使用光线攻击，而是变出了许多美味的果实，和小怪兽成为了好朋友！",
    storyEn: "On a beautiful blue planet, a tiny monster made of shiny crystal appeared. It was very hungry and looking for glowing energy stones. Ultraman flew down gently with warm light. Instead of attacking, he created delicious fruits, and they became great friends forever!",
    createdAt: Date.now() - 100000,
    words: [
      { word: "sun", phonetic: "/sʌn/", translation: "太阳", level: 1, example: "The sun is warm." },
      { word: "light", phonetic: "/laɪt/", translation: "光芒", level: 1, example: "The light is bright." },
      { word: "friend", phonetic: "/frend/", translation: "好朋友", level: 1, example: "We are good friends." },
      { word: "star", phonetic: "/stɑː/", translation: "星星", level: 1, example: "Stars shine at night." },
      { word: "fruit", phonetic: "/fruːt/", translation: "果实", level: 1, example: "Sweet and fresh fruit." },
      { word: "monster", phonetic: "/ˈmɒnstə/", translation: "怪兽", level: 2, example: "The little monster is cute." },
      { word: "crystal", phonetic: "/ˈkrɪstl/", translation: "水晶", level: 2, example: "A shiny crystal stone." },
      { word: "planet", phonetic: "/ˈplænɪt/", translation: "星球", level: 2, example: "Earth is a blue planet." },
      { word: "energy", phonetic: "/ˈenədʒi/", translation: "能量", level: 2, example: "The sun gives us energy." },
      { word: "attack", phonetic: "/əˈtæk/", translation: "攻击", level: 2, example: "Choose peace over attack." },
      { word: "delicious", phonetic: "/dɪˈlɪʃəs/", translation: "美味的", level: 3, example: "The apples are delicious." },
      { word: "protect", phonetic: "/prəˈtekt/", translation: "守护", level: 3, example: "Heroes protect the world." },
      { word: "universe", phonetic: "/ˈjuːnɪvɜːs/", translation: "宇宙", level: 3, example: "The universe is vast." },
      { word: "glowing", phonetic: "/ˈɡləʊɪŋ/", translation: "发光的", level: 3, example: "A glowing magic lamp." },
      { word: "peaceful", phonetic: "/ˈpiːsfl/", translation: "和平的", level: 3, example: "We live in a peaceful world." }
    ]
  },
  {
    id: "preset_dinosaur",
    topic: "小恐龙森林历险记",
    titleZh: "小霸王龙找彩虹",
    titleEn: "Little T-Rex and the Rainbow Quest",
    storyZh: "森林深处住着一只喜欢奔跑的小恐龙阿雷。雨过天晴后，天空中架起了一道美丽的七彩虹桥。阿雷跨过清澈的小溪，穿过高大的密林，收集了许多五颜六色的花朵，开启了一场奇妙的冒险，把惊喜送给了恐龙妈妈。",
    storyEn: "Deep in the green forest lived a little dinosaur named Ray who loved running. After the rain, a rainbow appeared in the sky. Ray jumped over the clear stream, ran through the tall trees, gathered colorful flowers, and started a grand adventure for his mother.",
    createdAt: Date.now() - 200000,
    words: [
      { word: "rain", phonetic: "/reɪn/", translation: "雨水", level: 1, example: "Rain falls from clouds." },
      { word: "tree", phonetic: "/triː/", translation: "密林", level: 1, example: "The tree is tall." },
      { word: "flower", phonetic: "/ˈflaʊə/", translation: "花朵", level: 1, example: "A pretty red flower." },
      { word: "run", phonetic: "/rʌn/", translation: "奔跑", level: 1, example: "Run in the park." },
      { word: "leaf", phonetic: "/liːf/", translation: "树叶", level: 1, example: "A green leaf falls." },
      { word: "rainbow", phonetic: "/ˈreɪnbəʊ/", translation: "彩虹", level: 2, example: "Look at the colorful rainbow." },
      { word: "forest", phonetic: "/ˈfɒrɪst/", translation: "森林", level: 2, example: "Birds sing in the forest." },
      { word: "stream", phonetic: "/striːm/", translation: "小溪", level: 2, example: "Clear water flows in the stream." },
      { word: "bridge", phonetic: "/brɪdʒ/", translation: "虹桥", level: 2, example: "Cross the wooden bridge." },
      { word: "surprise", phonetic: "/səˈpraɪz/", translation: "惊喜", level: 2, example: "What a nice surprise!" },
      { word: "adventure", phonetic: "/ədˈventʃə/", translation: "冒险", level: 3, example: "We start a grand adventure." },
      { word: "dinosaur", phonetic: "/ˈdaɪnəsɔː/", translation: "恐龙", level: 3, example: "The dinosaur is huge." },
      { word: "mysterious", phonetic: "/mɪˈstɪəriəs/", translation: "神秘的", level: 3, example: "A mysterious cave." },
      { word: "magnificent", phonetic: "/mæɡˈnɪfɪsnt/", translation: "壮丽的", level: 3, example: "A magnificent castle." },
      { word: "courageous", phonetic: "/kəˈreɪdʒəs/", translation: "勇敢的", level: 3, example: "Be a courageous explorer." }
    ]
  },
  {
    id: "preset_cat_magic",
    topic: "魔法猫咪城堡",
    titleZh: "会飞的魔法小黑猫",
    titleEn: "The Flying Magic Kitten",
    storyZh: "在云朵之上的魔法城堡里，有一只戴着金色铃铛的黑色小猫咪咪。它只要轻轻晃动魔法棒，就能变出彩虹糖果云朵，为整个童话小镇带来欢声笑语和甜甜的美梦。",
    storyEn: "In a magic castle above the clouds lived a little black kitten named Mimi with a golden bell. Whenever she waved her tiny wand, clouds turned into sweet rainbow candies, bringing laughter and joy to the fairy town.",
    createdAt: Date.now() - 300000,
    words: [
      { word: "cat", phonetic: "/kæt/", translation: "小猫", level: 1, example: "The cute cat is sleeping." },
      { word: "cloud", phonetic: "/klaʊd/", translation: "云朵", level: 1, example: "White clouds in the sky." },
      { word: "candy", phonetic: "/ˈkændi/", translation: "糖果", level: 1, example: "I like sweet candy." },
      { word: "bell", phonetic: "/bel/", translation: "铃铛", level: 1, example: "Jingle bell rings." },
      { word: "fly", phonetic: "/flaɪ/", translation: "飞翔", level: 1, example: "Birds fly high." },
      { word: "castle", phonetic: "/ˈkɑːsl/", translation: "城堡", level: 2, example: "A grand castle on the hill." },
      { word: "magic", phonetic: "/ˈmædʒɪk/", translation: "魔法", level: 2, example: "She has magic powers." },
      { word: "wand", phonetic: "/wɒnd/", translation: "魔法棒", level: 2, example: "Wave the magic wand." },
      { word: "town", phonetic: "/taʊn/", translation: "小镇", level: 2, example: "A quiet fairy town." },
      { word: "dream", phonetic: "/driːm/", translation: "美梦", level: 2, example: "Have a sweet dream." },
      { word: "laughter", phonetic: "/ˈlɑːftə/", translation: "欢声笑语", level: 3, example: "The room is full of laughter." },
      { word: "sparkle", phonetic: "/ˈspɑːkl/", translation: "闪耀", level: 3, example: "Stars sparkle at night." },
      { word: "whisper", phonetic: "/ˈwɪspə/", translation: "耳语", level: 3, example: "Whisper a secret." },
      { word: "enchanted", phonetic: "/ɪnˈtʃɑːntɪd/", translation: "魔法的", level: 3, example: "An enchanted garden." },
      { word: "celebration", phonetic: "/ˌselɪˈbreɪʃn/", translation: "庆典", level: 3, example: "Join our celebration." }
    ]
  },
  {
    id: "preset_space",
    topic: "太空宇航员探险",
    titleZh: "小小宇航员登月记",
    titleEn: "Little Astronaut on the Moon",
    storyZh: "小宇航员阿墨穿上洁白的宇航服，乘坐火箭飞向银河系。月球上的重力很小，他像袋鼠一样轻轻一跳就能蹦得老高，还在月球表面留下了一个可爱的小脚印！",
    storyEn: "Little astronaut Momo put on his white spacesuit and flew to the stars in a shiny rocket. With low gravity on the moon, he bounced high like a happy kangaroo and left tiny footprints on the lunar dust!",
    createdAt: Date.now() - 400000,
    words: [
      { word: "moon", phonetic: "/muːn/", translation: "月球", level: 1, example: "The moon shines at night." },
      { word: "star", phonetic: "/stɑː/", translation: "星星", level: 1, example: "Twinkle twinkle little star." },
      { word: "sky", phonetic: "/skaɪ/", translation: "天空", level: 1, example: "The sky is blue." },
      { word: "jump", phonetic: "/dʒʌmp/", translation: "跳跃", level: 1, example: "Jump high." },
      { word: "foot", phonetic: "/fʊt/", translation: "脚印", level: 1, example: "Footprints in snow." },
      { word: "rocket", phonetic: "/ˈrɒkɪt/", translation: "火箭", level: 2, example: "The rocket zooms into space." },
      { word: "galaxy", phonetic: "/ˈɡæləksi/", translation: "银河系", level: 2, example: "The milky way galaxy." },
      { word: "planet", phonetic: "/ˈplænɪt/", translation: "星球", level: 2, example: "Mars is a red planet." },
      { word: "suit", phonetic: "/suːt/", translation: "宇航服", level: 2, example: "Wear a spacesuit." },
      { word: "explore", phonetic: "/ɪkˈsplɔː/", translation: "探索", level: 2, example: "Explore new worlds." },
      { word: "astronaut", phonetic: "/ˈæstrənɔːt/", translation: "宇航员", level: 3, example: "An astronaut explores space." },
      { word: "gravity", phonetic: "/ˈɡrævəti/", translation: "重力", level: 3, example: "Zero gravity in space." },
      { word: "telescope", phonetic: "/ˈtelɪskəʊp/", translation: "望远镜", level: 3, example: "Look through a telescope." },
      { word: "satellite", phonetic: "/ˈsætəlaɪt/", translation: "卫星", level: 3, example: "A weather satellite." },
      { word: "constellation", phonetic: "/ˌkɒnstəˈleɪʃn/", translation: "星座", level: 3, example: "Find the Big Dipper constellation." }
    ]
  }
];

/**
 * Generate a Kid-Friendly Story with exact 10 or 15 Vocabulary Words via Gemini 3.7 Flash
 */
export const generateStoryWithVocabulary = async (
  topic: string,
  wordCount: 10 | 15 = 10
): Promise<StoryData | null> => {
  const ai = getGenAIClient();
  if (!ai) {
    // If API key is not yet set, match closest preset trimmed to requested wordCount
    const matched = PRESET_STORIES.find(s => s.topic.includes(topic) || topic.includes(s.topic)) || PRESET_STORIES[0];
    return {
      ...matched,
      id: `story_${Date.now()}`,
      words: matched.words.slice(0, wordCount)
    };
  }

  try {
    const prompt = `你是一位专门为6-8岁小朋友写故事的优秀童话作家与双语教学专家。
请围绕小朋友感兴趣的主题："${topic}"，创作一篇充满童趣、阳光正向、情节生动的中英双语小故事。
并且必须从中严格精选出恰好 ${wordCount} 个核心生词（要求中英文词义严格对应，并且这些生词必须直接出现在故事正文中）。

【严格要求】：
1. 生词总数量：必须严格等于 ${wordCount} 个！
2. 生词难度梯度排列（从小到大）：
   - 前 ${Math.floor(wordCount / 3)} 个词为 Level 1 (萌芽基础词，如 sun, ball, run)
   - 中间 ${Math.floor(wordCount / 3)} 个词为 Level 2 (进阶成长词，如 castle, dragon, forest, victory)
   - 剩余 ${wordCount - 2 * Math.floor(wordCount / 3)} 个词为 Level 3 (超能挑战词，如 energetic, magnificent, astronaut, determination)
3. 故事正文与生词选取要求（核心原则：杜绝中文单字误拆与泛滥染色）：
   - 生词的中文翻译（translation）必须是2个字或以上的规范完整词汇（如"篮球"、"传球"、"球框"、"森林"、"城堡"、"小猫"等），严禁使用单字（如不要单独只用'球'、'光'、'跑'等单字，应使用'篮球/皮球'、'光芒'、'奔跑'），确保故事中出现的词汇与词表中完整对应，避免误拆故事中其他复合词。
   - 中文故事（storyZh）：约130-180字，必须自然包含所有选定生词的中文翻译。
   - 英文故事（storyEn）：约90-130词，必须自然包含所有选定生词的英文原词。
4. 返回 JSON 格式：
{
  "titleZh": "中文标题",
  "titleEn": "英文标题",
  "storyZh": "中文故事正文",
  "storyEn": "英文故事正文",
  "words": [
    {
      "word": "英文原词",
      "phonetic": "/音标/",
      "translation": "中文对应词",
      "level": 1,
      "example": "简短例句"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleZh: { type: Type.STRING },
            titleEn: { type: Type.STRING },
            storyZh: { type: Type.STRING },
            storyEn: { type: Type.STRING },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  level: { type: Type.INTEGER },
                  example: { type: Type.STRING }
                },
                required: ["word", "translation", "level", "example"]
              }
            }
          },
          required: ["titleZh", "titleEn", "storyZh", "storyEn", "words"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.titleZh && parsed.words && parsed.words.length > 0) {
      return {
        id: `story_${Date.now()}`,
        topic,
        titleZh: parsed.titleZh,
        titleEn: parsed.titleEn,
        storyZh: parsed.storyZh,
        storyEn: parsed.storyEn,
        words: parsed.words.slice(0, wordCount).map((w: any, idx: number) => ({
          word: w.word,
          phonetic: w.phonetic || "",
          translation: w.translation || "",
          level: (w.level === 1 || w.level === 2 || w.level === 3 ? w.level : (idx < 5 ? 1 : idx < 10 ? 2 : 3)) as 1 | 2 | 3,
          example: w.example || ""
        })),
        createdAt: Date.now()
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini Story Generation failed:", error);
    const matched = PRESET_STORIES.find(s => s.topic.includes(topic) || topic.includes(s.topic)) || PRESET_STORIES[0];
    return {
      ...matched,
      id: `story_${Date.now()}`,
      words: matched.words.slice(0, wordCount)
    };
  }
};

/**
 * Generate Smart Exercise List
 */
export const generateSmartExercise = async (topic: string, isEnglish: boolean, count: number = 30) => {
  const ai = getGenAIClient();
  if (!ai) return null;

  try {
    const prompt = isEnglish 
      ? `为6岁的小朋友生成${count}个关于"${topic}"的英文打字练习单词。返回JSON数组，每个对象必须包含: text(单词), phonetic(音标), translation(中文翻译), example(简单的英文例句)。确保单词难度适合初学者。`
      : `为6岁的小朋友生成${count}个关于"${topic}"的中文打字练习词语。返回JSON数组，每个对象必须包含: text(对应词语的拼音，全小写，不带声调，词语间用空格隔开), chinese(对应的汉字), example(简单的中文例句)。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              phonetic: { type: Type.STRING },
              translation: { type: Type.STRING },
              chinese: { type: Type.STRING },
              example: { type: Type.STRING }
            },
            required: ["text"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Gemini failed:", error);
    return null;
  }
};
