const config = {
	//网页元数据
	metaData: {
		title: '✨Dazzling Dust的个人主页✨',
		description: 'Dazzing Dust’s Homepage',
		keywords: 'Shining Dust,Dazzling Dust,个人主页,个人网站',
		icon: 'https://q.qlogo.cn/headimg_dl?dst_uin=1246663835&spec=640&img_type=jpg'   //网页图标，支持外链
	},

	avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=1246663835&spec=640&img_type=jpg", // 头像
	welcometitle: "Welcome to Dazzing Dust’s homepage！", // 标题

	// 颜色配置
	color: {
		themecolor: "#FFFFFF", // 主题颜色，推荐趋于亮白可带有轻微色调，例： #D1FFEC
		welcometitlecolor: "#FFFFFF", // 标题颜色 例： #7BFFC9
		turntablecolor1: "#FFFF00",  // 转盘渐变色一
		turntablecolor2: "#00FFFF"   // 转盘渐变色二
	},

	brightness: 85, // 背景亮度 --%
	blur: 5, // 毛玻璃模糊效果

	// 我的标签
	tags: [ 'CHINA', 'Student', 'Minecraft', 'SKY', 'C++', 'HTML', '……'],

	// 默认背景壁纸
	background: {
		"pc": {  //pc端
			"type": "pic",   //"pic":静态壁纸;"video":动态壁纸
			"datainfo": {
				"title": "科技卧室",
				"preview": "/img/wallpaper/​static/image3-pre.webp",
				"url":"/img/wallpaper/​static/image3.png"//随机PC壁纸api："url":"https://t.mwm.moe/pc"
			},
		},
		"mobile": {  //移动端
			"type": "pic",
			"datainfo": {
				"title": "0001",
				"preview": "/img/wallpaper/static-mobile/0001/image-pre.webp",
			"url":"/img/wallpaper/static/image.png"
			}	//随机手机壁纸api:"url":"https://t.mwm.moe/mp"
		}

	},

	//极坐标图数据
	polarChart: {
		skills: ['Vue.js', 'React', 'JavaScript', 'Node', 'Java', 'Python', 'linux', 'Docker', 'MySQL', 'MongoDB', 'AWS'],
		skillPoints: [85, 78, 88, 90, 80, 78, 85, 65, 82, 78, 70],
	},

	//社交按钮 - 使用Iconify图标
	socialPlatformIcons: [
		{ icon: "line-md:github-loop", link: "https://github.com/DazzlingDust" },
		{ icon: "line-md:email", link: "mailto:DazzlingDust886@foxmail.com" },
		{ icon: "line-md:telegram", link: "https://t.me/Shining_Dust" },
		{ icon: "simple-icons:bilibili", link: "https://m.bilibili.com/space/3546706436164078" },
		{ icon: "iconamoon:lightning-1-light", link: "https://afdian.com/a/Shining_Dust" },
	],

	// //打字机
	// typeWriterStrings: [
	// 	"如果你看到了这行字，说明我已经成功吸引到了你的注意力。",
	// 	"顶峰的少年，给了你所有细节，你却说我不是迪迦，给不了你想要的光。",
	// 	"心简单，世界就简单，幸福才会生长；心自由，生活就自由，到哪都有快乐。",
	// 	"生命太短，没有时间留给遗憾，若不是终点，请微笑一直向前。"
	// ],

	//音乐播放配置，采用MetingJSApi(https://github.com/metowolf/MetingJS)
const musicPlayer = {
  server: 'netease',  // 服务提供商 - 网易云音乐
  type: 'playlist',    // 歌单类型
  id: '3778678',       // 歌单 ID（可以替换为你的歌单ID）
  token: '0050705497FF5123F4341A4B3A03817F1AA12AED60AEDC0D0877CE692D0CF08D06E45D2864FF1F61279CA7FA1337EF37F500DBB94BD186EF01E1D2F3153276C3CD2BBD407D6B929F55FAE52761DC6C669BDD15B8D1671B13B5536BD3D10E63B8910CF7C86FFD1EF0715F6E1A16398CDECE1A40DA4F0042A5D9378FA0FD102E3F5CF5C33CB779A37B0789421AB2C5C22D67634D2D105B4A2FDB02F62E88F9652EF8600640394A5116594682B1B4E9A52061B81AF945ED21F8EE99B53767039E0669BB61E6203BDD1A3A6CE95B11DA6F2E1A8ECD59AFA8184BB6D3BB3CE807589265023165250D59FBA2F5D756F4DC65DF60A9DBFBEE64135ED944F478FE9F45D9FACF4DB1A6744F8AEDA04730BC8AFE5A7D82CE20E77C75660208EA1774A92541542924221622AAB0F7C08156D1039CFC19A229D5C99CA59E463760CFDC951606853DC16BE0A50C70E5745881B1E439F609',    // 替换为你的网易云 Token
},

	//壁纸数据 -----可以将壁纸文件上传到图床获取网络直链。若想调用api，请前往脚本自行修改逻辑
	wallpaper: {
		pic: [
			{ "title": "绿野迷踪", "preview": "/img/wallpaper/static/image-pre.webp", "url": "/img/wallpaper/static/image.png" },
			{ "title": "黑白双煞", "preview": "/img/wallpaper/static/image2-pre.webp", "url": "/img/wallpaper/static/image2.png" },
			{ "title": "科技卧室", "preview": "/img/wallpaper/static/image3-pre.webp", "url": "/img/wallpaper/static/image3.png" },
			{ "title": "jswcMaMj", "preview": "https://s21.ax1x.com/2025/07/23/pVGli59.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGli59.jpg" },
			{ "title": "pgtTqoqq", "preview": "https://s21.ax1x.com/2025/07/23/pVGlmDO.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlmDO.jpg" },
			{ "title": "cvKMKhue", "preview": "https://s21.ax1x.com/2025/07/23/pVGlNqS.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlNqS.jpg" },
			{ "title": "XpxvQVoP", "preview": "https://s21.ax1x.com/2025/07/23/pVGlfIJ.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlfIJ.jpg" },
			{ "title": "fVEEjEOA", "preview": "https://s21.ax1x.com/2025/07/23/pVGlEgx.md.webp", "url": "https://s21.ax1x.com/2025/07/23/pVGlEgx.webp" },
			{ "title": "jgnIKMpd", "preview": "https://s21.ax1x.com/2025/07/23/pVGldaQ.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGldaQ.jpg" },
			{ "title": "mgqyySeh", "preview": "https://s21.ax1x.com/2025/07/23/pVGl82t.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGl82t.jpg" },
			{ "title": "dSXZfZp", "preview": "https://s21.ax1x.com/2025/07/23/pVGlaVg.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlaVg.jpg" },
		],
		picMobile: [
			{ "title": "0001", "preview": "/img/wallpaper/static-mobile/0001/image-pre.webp", "url": "/img/wallpaper/static-mobile/0001/image.png" },
			{ "title": "0002", "preview": "/img/wallpaper/static-mobile/0002/image-pre.webp", "url": "/img/wallpaper/static-mobile/0002/image.png" },
			{ "title": "0003", "preview": "/img/wallpaper/static-mobile/0003/image-pre.webp", "url": "/img/wallpaper/static-mobile/0003/image.png" },
			{ "title": "0004", "preview": "/img/wallpaper/static-mobile/0004/image-pre.webp", "url": "/img/wallpaper/static-mobile/0004/image.png" },
			{ "title": "DfNHPPcc", "preview": "https://s21.ax1x.com/2025/07/23/pVG1uQ0.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVG1uQ0.jpg" },
			{ "title": "cZZwzhis", "preview": "https://s21.ax1x.com/2025/07/23/pVG1Vij.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVG1Vij.jpg" },
			{ "title": "aANKZHPX", "preview": "https://s21.ax1x.com/2025/07/23/pVGlIR1.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlIR1.jpg" },
		],
		video: [
			{
				"title": "动态科幻风",
				"preview": "public/img/wallpaper/动态科幻风.mp4",
				"url": "public/img/wallpaper/动态科幻风.mp4"
			},
			{
				"title": "",
				"preview": "/img/wallpaper/",
				"url": "/img/wallpaper/"
			},
			{
				"title": "",
				"preview": "",
				"url": ""
			},
		],
		videoMobile: [
			{
				"title": "",
				"preview": "/img/wallpaper/"
			},
			{
				"title": "",
				"preview": "/img/wallpaper/",
				"url": ""
			},
			{
				"title": "",
				"preview": "/img/wallpaper/",
				"url": "/img/wallpaper/"
			},
		],
	},

	//项目卡片 其中 字段"show"控制初始卡片的text是否展开
	projectcards: [
		{ go: "🚀 前往", img: "http://q.qlogo.cn/headimg_dl?dst_uin=1246663835&spec=640&img_type=jpg", title: "Github's home page", subtitle: "The first work！", text: "If you see this line, I've managed to get your attention.", url: "https://github.com/DazzlingDust/DazzlingDust", show: false },
		{ go: "📸 前往", img: "https://t.mwm.moe/pc", title: "To be developed 2", subtitle: "The second work！", text: "If you see this line, I've managed to get your attention.", url: "https://DazzlingDust.xyz", show: false },
		{ go: "🎬 前往", img: "https://t.alcy.cc/moe", title: "To be developed 3", subtitle: "The third work！", text: "If you see this line, I've managed to get your attention.", url: "https://DazzlingDust.xyz", show: false },
		{ go: "🔍 前往", img: "https://t.alcy.cc/fj", title: "To be developed 4", subtitle: "The fourth work！", text: "If you see this line, I've managed to get your attention.", url: "https://DazzlingDust.xyz", show: false },
	],

	statement: ["备案号：XXICP备5201314号", "Copyright © 2025 DazzlingDust"],
}

export default config