# 📚 小学12册中英文教材词典审计表 (Dictionary Audit Report)

> **审计基准**：人教版小学英语教师用书词汇表（1-2 年级为新起点 SL 版，3-6 年级为 PEP 三年级起点版）与部编版语文教材生字表组词。
> **数据来源**：`constants.ts` 的 `RAW_TEXTS`（词表）、`EN_METADATA`（英语音标/释义/例句）、`CN_METADATA`（语文例句）。
> **当前版本**：2026-08-29 全量重制（B.2.0）

---

## 📌 统计摘要

- **英语教材覆盖**：12 册全入库，共 **1151 词**（每册 81~129 词），包含音标、中文释义与例句。
- **语文教材覆盖**：12 册全入库，共 **1263 词**（每册 75~146 词），包含拼音与例句。
- **合计**：**2414 词条**，全部通过 `parseTextToItems` 动态解析，支持零延迟朗读、音节分色与拼音渲染。

## 📋 各册词汇量

| 册别 | 词汇量 |
|---|---|
| GRADE 1-Fall | 83 |
| GRADE 1-Spring | 81 |
| GRADE 2-Fall | 85 |
| GRADE 2-Spring | 86 |
| GRADE 3-Fall | 111 |
| GRADE 3-Spring | 92 |
| GRADE 4-Fall | 88 |
| GRADE 4-Spring | 98 |
| GRADE 5-Fall | 107 |
| GRADE 5-Spring | 108 |
| GRADE 6-Fall | 129 |
| GRADE 6-Spring | 83 |
| 语文一年级上册 | 146 |
| 语文一年级下册 | 109 |
| 语文二年级上册 | 98 |
| 语文二年级下册 | 75 |
| 语文三年级上册 | 121 |
| 语文三年级下册 | 93 |
| 语文四年级上册 | 108 |
| 语文四年级下册 | 90 |
| 语文五年级上册 | 111 |
| 语文五年级下册 | 124 |
| 语文六年级上册 | 88 |
| 语文六年级下册 | 100 |

## 🔤 英语词库构成说明

- **一年级（上/下）**：新起点 SL 1A/1B 单元词汇（School/Face/Animals/Numbers/Colours/Fruit、Classroom/Room/Toys/Food/Drink）。
- **二年级（上/下）**：新起点 SL 2A/2B 单元词汇（Family/Parks/Streets/Sports、Playtime/Body/Seasons/Time/Shopping）。
- **三年级起**：PEP 教师用书附录单元词汇表全量收录（含四会词、认读词与核心句型短语，如 "go straight"、"help yourself"）。
- 音标采用英式 DJ 音标；例句使用课堂高频句型，控制在小学生在读难度内。

## 📖 语文词库构成说明

- 以**写字表生字组词**为主轴，**识字表常用字**为补充，覆盖每册要求掌握的生字。
- 低年级（1-2 年级）：以双字常用词为主，搭配课文主题词（如《小蝌蚪找妈妈》《植物妈妈有办法》）。
- 中高年级（3-6 年级）：以课文重点词语、四字成语为主（如"守株待兔""锲而不舍""完璧归赵"）。
- 拼音由 pinyin-pro 自动生成（无声调小写形式供打字），例句为小学生造句风格。

## 🛠️ 审计反馈提交模板

如果发现需要调整的内容，请复制下方格式反馈：

```markdown
### 词库修改申请
- 所在册别：[例如：GRADE 3-Fall]
- 涉及单词：[例如：pencil box]
- 原字段：[音标: /ˈpensl bɒks/ | 释义: 铅笔盒]
- 修改为：[音标: /ˈpensl bɒks/ | 释义: 文具盒 / 铅笔盒]
- 变更说明：[统一译法为统编教材规范称谓]
```

---

## 附：全量词表索引

### GRADE 1-Fall（83 词）

school, book, ruler, pencil, eraser, pencil box, bag, teacher, hello, hi, goodbye, bye, name, my, your, face, ear, eye, nose, mouth, look, dog, cat, bird, tiger, monkey, elephant, panda, zoo, one, two, three, four, five, six, seven, eight, nine, ten, red, yellow, blue, green, black, white, brown, orange, pink, purple, apple, pear, banana, peach, grapes, watermelon, strawberry, fruit, sweet, ant, duck, egg, jet, kite, leg, hand, foot, head, arm, body, hair, good, morning, afternoon, night, day, sun, moon, star, sky, rain, snow, wind, cloud

### GRADE 1-Spring（81 词）

classroom, desk, chair, blackboard, door, window, in, on, under, where, room, table, bed, lamp, sofa, toy, plane, ball, doll, car, bus, bike, teddy bear, rice, noodles, chicken, fish, vegetable, hungry, thirsty, juice, milk, water, tea, cake, bread, hamburger, hot dog, coffee, candy, kangaroo, lion, giraffe, deer, snake, cute, fat, thin, big, small, tall, short, long, family, dad, mum, brother, sister, grandma, grandpa, friend, boy, girl, yes, no, please, sorry, ok, dance, sing, draw, jump, run, walk, swim, fly, sleep, get up, go to school, go home, bus stop

### GRADE 2-Fall（85 词）

grandfather, grandmother, father, mother, man, woman, park, grass, flower, tree, lake, hill, street, shop, cinema, supermarket, hospital, train, ship, taxi, jeep, boat, map, basketball, football, ping-pong, tennis, sports, music, art, math, chinese, english, science, computer, painting, game, farmer, driver, doctor, nurse, cook, worker, pupil, study, work, play, read, write, help, love, happy, sad, new, old, cold, hot, cool, warm, breakfast, lunch, dinner, time, clock, watch, spring, summer, autumn, winter, season, sunny, windy, cloudy, rainy, snowy, shirt, skirt, dress, socks, shoes, jacket, sweater, jeans, shorts, coat

### GRADE 2-Spring（86 词）

skate, plant, hobby, team, win, can, wish, party, gift, card, balloon, candle, song, letter, picture, photo, picnic, outside, weather, wet, dry, slow, fast, left, right, stop, wait, turn, money, buy, sell, cheap, expensive, pretty, beautiful, nice, clean, dirty, open, close, light, dark, floor, wall, home, phone, fridge, soup, spoon, knife, fork, bowl, chopsticks, cup, glass, plate, beef, bottle, box, cap, hat, queen, king, robot, puppy, kitten, pig, sheep, cow, horse, hen, rabbit, bear, mouse, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, student, classmate

### GRADE 3-Fall（111 词）

pen, pencil, pencil box, bag, book, ruler, eraser, crayon, school, hello, hi, goodbye, bye, i\'m, name, my, your, this, miss, mum, are, fine, thanks, let\'s, go, to, now, wow, see, say, uh, great, bye-bye, mr, good morning, good afternoon, nice to meet you, stand up, sit down, face, ear, eye, nose, mouth, head, arm, hand, leg, foot, body, red, yellow, blue, green, black, white, brown, orange, pink, purple, funny, play with, real, dog, cat, bird, tiger, monkey, elephant, panda, duck, pig, bear, rabbit, zoo, animal, bread, juice, milk, water, cake, fish, rice, egg, chicken, one, two, three, four, five, six, seven, eight, nine, ten, have some, i\'d like, here you are, thank you, you\'re welcome, can i have some, how old are you, make a wish, cut the cake, share, eat, drink, taste, smell, touch, follow me

### GRADE 3-Spring（92 词）

welcome, welcome back, she, he, today, from, china, uk, usa, canada, new friend, wait a minute, how beautiful, isn\'t, family members, lovely, father, mother, man, woman, brother, sister, grandmother, grandfather, dad, mum, boy, girl, teacher, student, friend, giraffe, deer, so, children, child, tall, short, long, fat, thin, big, small, tail, come here, look at that, has, hide, find, excuse me, silly, honey, apple, pear, orange, banana, grape, watermelon, strawberry, buy, fruit, car, map, boat, desk, chair, ball, cap, toy, box, plane, in, on, under, how many, so many, good idea, open it and see, live, live in, for sale, oh no, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty

### GRADE 4-Fall（88 词）

classroom, window, blackboard, light, picture, door, floor, computer, tv, really, near, clean the classroom, let me, schoolbag, candy, notebook, storybook, key, wow so much, lost, chinese book, english book, maths book, quiet, friendly, hair, shoe, glasses, his, her, or, right, strong, bedroom, living room, study, kitchen, bathroom, bed, phone, table, sofa, fridge, home, room, are they, these are, i\'m hungry, what\'s for dinner, what would you like, help yourself, pass me the bowl, cut the vegetables, use the spoon, use the fork, ready, dinner\'s ready, parents, uncle, aunt, baby brother, football player, job, basketball, football, doctor, cook, driver, farmer, nurse, people, but, little, puppy, welcome to my home, my family has, that\'s only, add, beef, chicken, noodles, soup, vegetable, chopsticks, bowl, knife, fork, spoon

### GRADE 4-Spring（98 词）

playground, library, art room, computer room, music room, first floor, second floor, teachers\' office, welcome to our school, this way please, do you have, yes we do, no it isn\'t, what time is it, it\'s 7 o\'clock, english class, music class, pe class, it\'s time for, it\'s time to get up, it\'s time to go to school, it\'s time to go home, it\'s time to go to bed, just a minute, over there, school starts at, am, pm, breakfast, lunch, dinner, cold outside, be careful, weather report, what\'s the weather like, it\'s rainy today, not much, how about, degree, world, cold, cool, warm, hot, sunny, windy, cloudy, snowy, rainy, tomato, potato, green beans, carrot, horse, cow, sheep, hen, farm, these, those, animal, garden, eat up, clothes, pants, dress, skirt, coat, sweater, sock, shorts, jacket, shirt, whose, whose coat is this, it\'s mine, they\'re my father\'s, put away, put on, take off, hang up, wash, shoes, umbrella, sunglasses, scarf, gloves, how much is it, i\'ll take it, size, of course, too, more, assistant, expensive, cheap, pretty, nice

### GRADE 5-Fall（107 词）

old, young, kind, strict, polite, hard-working, helpful, clever, shy, ms, mr, will, sometimes, robot, our, head teacher, very hard, is he strict, he\'s very kind, monday, tuesday, wednesday, thursday, friday, saturday, sunday, weekend, wash my clothes, watch tv, do homework, read books, play football, often, do you often, park, tired, sport, should, every day, schedule, sandwich, salad, hamburger, ice cream, tea, fresh, healthy, delicious, hot, drink, thirsty, favourite, what\'s your favourite, they\'re sweet, beef noodles, fish sandwich, tomato soup, dance, sing, draw, swim, cook, speak english, what can you do, kung fu, do kung fu, play the pipa, sing english songs, draw cartoons, play basketball, play ping-pong, clock, plant, bottle, photo, front, between, above, beside, behind, there is, there are, in my room, water bottle, so many plants, move into, just a minute, forest, river, lake, mountain, hill, tree, bridge, building, village, house, go boating, aren\'t, quiet, nature park, on the mountain, under the tree, no people, rabbit, high, wall

### GRADE 5-Spring（108 词）

do morning exercises, eat breakfast, have class, play sports, eat dinner, when, exercise, usually, noon, o\'clock, why, shop, start, sound, take a dancing class, dancing, last, also, busy, need, play music, go for a walk, go shopping, clean my room, take, picnic, pick apples, go swimming, which, best, because, snow, vacation, leaf, leaves, colourful, paint a picture, merry, summer is here, january, february, march, april, may, june, july, august, september, october, november, december, few, thing, meet, chinese test, sports meet, easter, trip, year, month, first, second, third, fourth, fifth, twelfth, twentieth, twenty-first, thirtieth, special, fool, date, birthday party, playing, jumping, eating, drinking, sleeping, running, climbing, swinging, fighting, mine, yours, his, hers, theirs, ours, each other, care for, look there, drinking water, so cute, what are they doing, having class, eating lunch, reading a book, listening to music, keep to the right, keep your desk clean, talk quietly, take turns, quietly, show, anything else, exhibition, say no to, look for

### GRADE 6-Fall（129 词）

science museum, post office, bookstore, cinema, hospital, crossing, turn left, turn right, go straight, next to, far, tell, gps, follow, feature, italian restaurant, get there, get to, on foot, by bus, by taxi, by subway, by train, by ship, by plane, by bike, slow down, stop and wait, traffic lights, helmet, must, wear, pay attention to, traffic, munich, germany, alaska, sled, ferry, scotland, so many ways, on a sled, visit, film, see a film, take a trip, supermarket, evening, tonight, tomorrow, next week, dictionary, comic book, word book, postcard, mid-autumn festival, mooncake, poem, moon, together, get together, study, puzzle, hiking, pen pal, hobby, jasmine flower, idea, canberra, amazing, shall, goal, join, club, share, factory worker, postman, businessman, police officer, fisherman, scientist, pilot, coach, country, sea, stay healthy, university, if, use, type, quickly, angry, afraid, sad, worried, happy, see a doctor, wear warm clothes, take a deep breath, count to ten, chase, mice, bad, hurt, ill, wrong, feel, well, sit, grass, hear, ant, everyone, mud, pull, what\'s wrong, how does dad feel, not well, go to the zoo, not really, run after, look so sad, science, teacher, student, farmer, driver, nurse, cook

### GRADE 6-Spring（83 词）

younger, older, taller, shorter, longer, thinner, heavier, bigger, smaller, stronger, dinosaur, hall, meter, than, both, kilogram, countryside, lower, shadow, smarter, become, cleaned my room, washed my clothes, stayed at home, watched tv, drank tea, last weekend, last night, last monday, yesterday, before, read a book, saw a film, had a cold, slept, yesterday morning, what did you do, stayed at home and slept, cleaned the window, washed the dishes, went, camp, went camping, went fishing, rode a horse, hurt my foot, ate fresh food, took pictures, bought gifts, beach, basket, part, licked, laughed, ball, till, couldn\'t, dining hall, gym, ago, cycling, go cycling, ice-skate, badminton, star, easy, look up, internet, different, active, race, nothing, thought, felt, cheetah, woke, dream, was, were, will be, there was, there were, didn\'t

### 语文一年级上册（146 词）

一天, 二月, 三人, 上山, 口水, 目光, 耳朵, 手心, 日子, 田里, 禾苗, 火车, 虫子, 云朵, 山水, 八个, 十个, 儿子, 大人, 月儿, 头发, 里面, 可是, 东方, 西方, 天上, 四个, 女生, 水里, 来了, 不会, 小心, 多少, 牛羊, 果子, 小鸟, 早上, 书本, 尺子, 本子, 木头, 树林, 泥土, 力气, 心里, 中国, 五个, 立正, 正在, 后来, 我们, 好人, 长大, 尾巴, 下雨, 他们, 问好, 有人, 半天, 从来, 你们, 明天, 同学, 学习, 自己, 衣服, 白天, 竹子, 牙齿, 小马, 用力, 几个, 一只, 石头, 很多, 出去, 看见, 对面, 妈妈, 全家, 回家, 工人, 工厂, 太阳, 星星, 晚上, 下雪, 冬天, 春天, 夏天, 秋天, 夜晚, 学校, 老师, 拍手, 高兴, 快乐, 游戏, 玩具, 朋友, 兄弟, 姐妹, 爸爸, 爷爷, 奶奶, 谢谢, 再见, 你好, 大家, 一起, 玩耍, 唱歌, 跳舞, 画画, 看书, 写字, 读书, 听讲, 举手, 起立, 坐下, 窗户, 桌子, 椅子, 铅笔, 橡皮, 花朵, 小草, 大树, 叶子, 河水, 大海, 鱼儿, 乌龟, 兔子, 青蛙, 鸭子, 国旗, 美丽, 白云, 土地, 天空, 树木, 森林, 什么, 说话

### 语文一年级下册（109 词）

春风, 冬雪, 花开, 飞鸟, 入水, 国王, 王子, 红色, 绿色, 晴天, 请问, 清水, 心情, 事情, 生动, 千万, 百花, 齐心, 电话, 友谊, 高山, 语文, 数学, 音乐, 伙伴, 这里, 那里, 月亮, 故乡, 身体, 运动, 远近, 听说, 左右, 因为, 江南, 荷叶, 红豆, 地方, 没有, 许多, 种子, 发芽, 树叶, 雨水, 青草, 河水清, 温暖, 冰冷, 金色, 银色, 彩色, 彩虹, 阳光, 影子, 前后, 旁边, 中间, 上面, 下面, 左右手, 名字, 生字, 词语, 句子, 课文, 故事, 童话, 汽车, 飞机, 轮船, 走路, 跑步, 跳跃, 游泳, 骑车, 书包, 铅笔盒, 本领, 本领大, 主意, 办法, 着急, 高兴地, 慢慢地, 轻轻地, 认真地, 快乐地, 邻居, 家乡, 亲人, 热情, 礼貌, 帮助, 感谢, 劳动, 干净, 整齐, 明亮, 安静, 温暖的家, 爱护, 保护, 空气, 新鲜, 健康, 平安, 生气, 开心

### 语文二年级上册（98 词）

两个, 哪里, 宽大, 头顶, 眼睛, 肚皮, 孩子, 跳高, 变化, 一片, 傍晚, 海洋, 工作, 坏事, 办法, 如果, 毛笔, 写信, 圆珠笔, 电灯, 电影, 今天, 深处, 熊猫, 辛苦, 农忙, 归来, 爱戴, 英雄, 队旗, 铜号, 欢笑, 杨树, 壮丽, 梧桐, 枫叶, 松柏, 棉花, 杉树, 化石, 季节, 蝴蝶, 麦苗, 桑叶, 农家, 植物, 旅行, 准备, 降落伞, 纷纷, 观察, 粗心, 得到, 知识, 四海为家, 脚尖, 愉快, 广场, 围绕, 池塘, 名胜古迹, 群山, 凉快, 百闻不如一见, 展翅, 滑冰, 报纸, 雪花, 名不虚传, 一动不动, 淹没, 冲毁, 灾害, 恢复, 教训, 治理, 疏通, 驱赶, 房屋, 其余, 带领, 哨兵, 翻译, 危险, 讨好, 百兽, 违抗, 纳闷, 拔河, 为难得, 亲切, 脚印, 暖和, 痛快, 盛开, 玩耍, 喊叫, 纷纷出发

### 语文二年级下册（75 词）

春天, 寻找, 姑娘, 野花, 柳枝, 桃花, 杏花, 冲出, 原来, 叔叔, 邮局, 礼物, 先生, 太太, 做客, 惊奇, 快活, 美好, 植树, 格外, 引人注目, 满意, 休息, 树苗, 笔直, 汗珠, 甚至, 花草, 原野, 五颜六色, 精灵, 叮咛, 聊天, 草坪, 烟囱, 一般, 彩色, 梦想, 拉手, 结果, 苹果, 喜欢, 碧绿, 剪刀, 细雨, 健康, 洒脱, 敲鼓, 漫步, 凉棚, 难道, 神气, 住嘴, 争论, 评理, 道理, 一致, 清晨, 相遇, 狐狸, 老虎, 肉, 抬, 值日, 温暖, 干涸, 井, 泉眼, 尽, 惜, 照, 晴, 柔, 荷, 露

### 语文三年级上册（121 词）

早晨, 穿戴, 鲜艳, 服装, 打扮, 敬爱, 敬礼, 安静, 树枝, 好奇, 招引, 洁白, 摇晃, 影子, 落下, 荒野, 跳舞, 狂欢, 互相, 能够, 猜出, 扬起, 双臂, 朗读, 飘扬, 假日, 亲人, 教师, 观察, 蒲公英, 合拢, 手掌, 玩耍, 一本正经, 引人注目, 假睡, 寒冷, 雨珠, 钥匙, 颜料, 频频, 凉爽, 丰收, 加紧, 过冬, 歌曲, 温柔, 留意, 香甜, 蜂蜜, 清甜, 油亮亮, 杨树, 火红, 邮票, 菊花, 仙子, 丁香, 盛气凌人, 挖掘, 水泥, 亮晶晶, 图案, 排列, 规则, 凌乱, 增添, 棕红, 迟到, 经常, 故宫, 旅行, 蚂蚁, 兄台, 住宅, 临时, 住址, 洞穴, 专家, 顺畅, 卧室, 卫生间, 选择, 搜集, 倾斜, 隧道, 搜索, 扑空, 趁机, 痕迹, 懒惰, 平展, 悲哀, 镜子, 消毒, 忧虑, 若明若暗, 即使, 警觉, 锐利, 十分, 洞口, 翘起, 讨厌, 发明, 百发百中, 一致, 掌声, 文静, 默默, 轮流, 讲台, 热烈, 持久, 平息, 情况, 鼓励, 勇气, 鞠躬, 礼貌, 司空见惯

### 语文三年级下册（93 词）

燕子, 乌黑, 轻快, 翅膀, 剪刀, 尾巴, 活泼, 微风, 赶集, 聚拢, 光彩夺目, 掠过, 稻田, 偶尔, 沾水, 荡漾, 荷花, 清香, 莲蓬, 破裂, 姿势, 仿佛, 衣裳, 舞蹈, 翩翩起舞, 蜻蜓, 守株待兔, 耕田, 触株, 颈部, 释放, 骄傲, 谦虚, 懦弱, 尘土, 捧起, 擦洗, 古代, 价值, 动手, 狮子, 鹿角, 池塘, 欣赏, 匀称, 精美, 别致, 犹豫, 机灵, 逼近, 没精打采, 争奇斗艳, 芬芳, 展示, 修建, 组成, 蜜蜂, 辨认, 能力, 阻力, 包括, 准确, 无误, 沿路, 陌生, 超常, 记忆, 本能, 放下, 实际, 看法, 幸福, 集合, 国家, 云朵, 沙滩, 迅速, 海参, 海藻, 危险, 攻击, 窃窃私语, 属, 内, 营养, 领土, 差异, 物质, 宋, 排, 服饰, 观望, 旭日

### 语文四年级上册（108 词）

观潮, 据说, 大堤, 宽阔, 笼罩, 人山人海, 屹立, 若隐若现, 昂首, 顿时, 人声鼎沸, 浩浩荡荡, 山崩地裂, 霎时, 余波, 依旧, 牵手, 鹅卵石, 坑坑洼洼, 填平, 庄稼, 风俗, 跃出, 葡萄, 稻谷, 成熟, 柔和, 河床, 新鲜, 修补, 科学, 横贯, 虚弱, 愉快, 呼风唤雨, 世纪, 技术, 改变, 程度, 超过, 幻想, 原子核, 奥秘, 日益, 联系, 物质, 哲学家, 任何, 改善, 蝙蝠, 雷达, 避开, 敏捷, 捕捉, 苍蝇, 揭开, 推进, 障碍, 荧光屏, 恐龙, 凶猛, 笨重, 迟钝, 鸽子, 末期, 描绘, 隧道, 形态, 膨大, 前肢, 具备, 开辟, 脱离, 无忧无虑, 生气勃勃, 天高地阔, 月明人静, 一丝不苟, 空空如也, 枝折花落, 从容不迫, 扬长而去, 没完没了, 屏息凝视, 变化多端, 屋檐, 装饰, 顺序, 华丽, 独特, 照例, 率领, 觅食, 捣衣, 向导, 和谐, 辛苦, 蚕桑, 耘田, 慰藉, 卜落, 威力, 锐利, 河滩, 帐子, 闪烁, 奇幻, 帐单

### 语文四年级下册（90 词）

寂静, 譬如, 慰藉, 敏锐, 例行, 检查, 庄严, 胸脯, 站岗, 帐篷, 倒霉, 忧伤, 处境, 理智, 控制, 混乱, 简陋, 野蛮, 忧郁, 至于, 淡忘, 宽慰, 荒岛, 凄凉, 寂寞, 恐惧, 宴会, 栅栏, 贷方, 凄惨, 欣慰, 书籍, 而已, 聊天, 复活, 节日, 鞭炮, 腊月, 大蒜, 饺子, 摊贩, 彼此, 贺年, 骆驼, 恰好, 一律, 彩绘, 糊涂, 搅和, 浓稠, 可靠, 猜想, 粉碎, 外套, 解释, 教授, 困境, 既然, 此时, 万象更新, 悬灯结彩, 不可思议, 见微知著, 锲而不舍, 追根求源, 无独有偶, 饶有趣味, 焉知非福, 截然不同, 哄堂大笑, 能歌善舞, 随心所欲, 绿毯, 线条, 柔美, 惊叹, 回味, 乐趣, 目的地, 洒脱, 衣裳, 彩虹, 马蹄, 拘束, 羞涩, 摔跤, 偏偏, 河, 敬酒, 奏

### 语文五年级上册（111 词）

白鹭, 精巧, 色素, 适宜, 生硬, 流线型, 镜子, 孤独, 悠闲, 黄昏, 恩惠, 播种, 浇水, 吩咐, 爱慕, 体面, 深浅, 分辨, 便宜, 石榴, 架子, 尤其, 缠着, 盛开, 及时, 新鲜, 完整, 杭州, 茶叶, 飘落, 迷信, 紧邻, 至少, 懂得, 担忧, 上瘾, 缠问, 糕饼, 浸泡, 杭绸, 收获, 吩咐过, 榨油, 短促, 茂盛, 珍惜, 迟延, 协调, 素净, 愈, 酬谢, 珍宝, 叮嘱, 崩塌, 发誓, 谎话, 牺牲, 千真万确, 牛郎, 嫂子, 床铺, 笑嘻嘻, 成家立业, 相依为命, 晚霞, 温和, 亲密, 灿烂, 怒发冲冠, 难以置信, 举世闻名, 众星拱月, 玲珑剔透, 诗情画意, 太平盛世, 金碧辉煌, 完好无缺, 灰烬, 奉命, 肩负, 漫游, 悲哀, 估量, 瑰宝, 建筑, 宏伟, 仿照, 搜集, 仿制, 统统, 销毁, 罪证, 朗诵, 背诵, 训斥, 名夷, 负荆请罪, 同心协力, 攻无不克, 战无不胜, 完璧归赵, 理直气壮, 无价之宝, 绝口不提, 神机妙算, 喜不自胜, 天造地设, 踉踉跄跄, 抓耳挠腮, 伸头缩颈, 力倦神疲

### 语文五年级下册（124 词）

昼夜, 耕耘, 稚子, 蚂蚱, 樱桃, 瞎闹, 锄头, 承认, 随意, 阴凉, 割草, 倭瓜, 威吓, 露馅, 屏障, 芝麻, 神圣, 侵犯, 摔跤, 乐此不疲, 情不自禁, 肃然起敬, 摩拳擦掌, 跃跃欲试, 兴致勃勃, 养尊处优, 手忙脚乱, 恍然大悟, 哭笑不得, 若有所思, 半信半疑, 瞑目蹲身, 纵身, 颤抖, 慈祥, 荣幸, 眷恋, 锻炼, 繁忙, 特殊, 尊重, 呐喊, 陷坑, 诡计, 霹雳, 酥软, 耻笑, 胸膛, 拳头, 恶意, 败坏, 祸事, 袍子, 嫌弃, 讥笑, 顽劣, 家具, 桥梁, 寂寞, 眉目, 搔痒, 屡次, 锲而不舍, 锈, 断绝, 拱桥, 屏息, 巅峰, 锻炼, 阔别, 晶莹, 蒸腾, 跋涉, 污迹, 懊悔, 狂奔, 惊慌, 渗透, 拥挤, 遮蔽, 朦胧, 玫瑰, 继续, 缠绵, 模仿, 聘请, 燃烧, 铃铛, 枣红, 挣断, 揭穿, 静候, 谴责, 碍事, 怀疑, 阵亡, 招募, 服从, 残疾, 犹豫, 犹豫不决, 创举, 雕刻, 遗产, 智慧, 才干, 妒忌, 军令状, 迟延, 探听, 幔子, 私自, 调度, 水寨, 擂鼓, 支援, 丞相, 限度, 熬夜, 吃惊, 虚张声势, 弓弩, 迟, 悬挂

### 语文六年级上册（88 词）

绿毯, 渲染, 勾勒, 洒脱, 迂回, 疾驰, 马蹄, 拘束, 羞涩, 摔跤, 天涯, 回味, 幽雅, 笨拙, 单薄, 模糊, 恍然, 赠予, 愁怨, 顺心, 妩媚, 安适, 摇篮曲, 催眠曲, 舒畅, 僵硬, 照耀, 顾虑, 眺望, 茫茫, 巍峨, 耸立, 槐树, 疙瘩, 朦胧, 先驱, 檀香, 督促, 储蓄, 缩短, 距离, 启迪, 受益, 躯干, 徘徊, 蒸融, 游丝, 赤裸裸, 叹息, 惋惜, 队列, 咚咚, 揪, 沙哑, 凶猛, 放肆, 狞笑, 势不可当, 跌跌撞撞, 祭奠, 清瘦, 搀扶, 祭扫, 放晴, 惟妙惟肖, 汹涌, 澎湃, 熄灭, 掀翻, 肆虐, 抠, 娇小, 流淌, 阻止, 禁止, 焦躁, 熄, 咆哮, 嗓子, 惊慌, 跌, 呻吟, 滥, 窑洞, 呛, 抉择, 沮, 谜

### 语文六年级下册（100 词）

腊八, 粥, 蒜, 醋, 摊贩, 彼此, 贺年, 骆驼, 恰好, 一律, 彩绘, 分外, 搅和, 可靠, 猜想, 粉碎, 外套, 解释, 困境, 恐惧, 宴会, 栅栏, 帐篷, 倒霉, 忧伤, 处境, 理智, 混乱, 简陋, 野蛮, 忧郁, 淡忘, 宽慰, 万象更新, 悬灯结彩, 不可思议, 见微知著, 司空见惯, 追根求源, 无独有偶, 饶有趣味, 焉知非福, 截然不同, 哄堂大笑, 能歌善舞, 行善积德, 两面三刀, 随心所欲, 华丽, 残缺, 眷恋, 萦绕, 优雅, 静谧, 卓越, 弥漫, 卓越贡献, 锲而不舍, 机械, 领域, 逻辑, 真理, 疑问, 敏感, 定律, 建树, 景仰, 签名, 频率, 惋惜, 阀门, 爆炸, 心平气和, 理所当然, 难以忘怀, 振作, 清醒, 缰绳, 铲除, 秃, 蛾, 饲料, 屿, 救星, 复兴, 轻蔑, 手枪, 恐惧, 魁梧, 寡妇, 嘀咕, 扰乱, 忧, 仪式, 抱歉, 埋怨, 糟糕, 碰见, 揍, 缸

