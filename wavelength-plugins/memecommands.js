"use strict";

const FS = require("../lib/fs.js");

let memes = FS("config/chat-plugins/memes.json").readIfExistsSync();

if (memes !== "") {
	memes = JSON.parse(memes);
} else {
	memes = {};
}

function write() {
	FS("config/chat-plugins/memes.json").writeUpdate(() => (
		JSON.stringify(memes)
	));
	let data = "{\n";
	for (let u in memes) {
		data += '\t"' + u + '": ' + JSON.stringify(memes[u]) + ",\n";
	}
	data = data.substr(0, data.length - 2);
	data += "\n}";
	FS("config/chat-plugins/memes.json").writeUpdate(() => (
		data
	));
}

exports.commands = {
	"!shrug": true,
	shrug: function () {
		this.parse("¯\\_(ツ)_/¯");
	},

	murder: function (target, room, user) {
		if (!target) return this.errorReply(`/murder needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has murdered ${WL.nameColor(target, true, true)}!`);
		targetUser.popup("WASTED!");
	},

	"!slap": true,
	slap: function (target) {
		if (!target) return this.errorReply("/slap needs a target.");
		this.parse(`/me slaps ${target} in the face with a slipper!`);
	},

	"!eat": true,
	eat: function (target) {
		if (!target) return this.errorReply("/eat needs a target.");
		this.parse(`/me eats ${target}!`);
	},

	"!marry": true,
	marry: function (target, room, user) {
		if (!target) return this.errorReply("/marry needs a target.");
		this.parse(`/me has proposed to ${target}!`);
	},

	foh: function (target, room, user) {
		if (!target) return this.errorReply(`/foh needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has just told ${WL.nameColor(target, true, true)} to get the fuck outta here!`);
		targetUser.popup("GET THE FUCK OUTTA HERE BOI!");
	},

	hid: function (target, room, user) {
		if (!target) return this.errorReply(`/hid needs a target.`);
		if (!this.can("mute", null, room)) return false;
		room.addRaw(`${WL.nameColor(user.name, true, true)} has hid behind ${WL.nameColor(target, true, true)}.`);
	},

	idgaf: function (target, room, user) {
		if (!target) return this.errorReply(`/idgaf needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} doesn't give a fuck about  ${WL.nameColor(target, true, true)}!`);
		targetUser.popup("Idgaf!");
	},

	smash: function (target, room, user) {
		if (!target) return this.errorReply(`/smash needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has head smashed  ${WL.nameColor(target, true, true)}!`);
		targetUser.popup("FUCKING SMASHING!");
	},

	spank: function (target, room, user) {
		if (!target) return this.errorReply(`/spank needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} spanked  ${WL.nameColor(target, true, true)}!`);
	},

	outrage: function (target, room, user) {
		if (!target) return this.errorReply(`/outrage needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} uses Outrage on the opposing ${WL.nameColor(target, true, true)}!`);
		targetUser.popup("Watch out for the wrath!");
	},

	catch: function (target, room, user) {
		if (!target) return this.errorReply(`/catch needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has caught ${WL.nameColor(target, true, true)} in their Pokeball.`);
		targetUser.popup("FUCKING SMASHING!");
	},

	explode: function (target, room, user) {
		if (!target) return this.errorReply(`/explode needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has exploded on ${WL.nameColor(target, true, true)}!`);
		targetUser.popup("ALLY AKBAR!!!!!!");
	},

	slam: function (target, room, user) {
		if (!target) return this.errorReply(`/slam needs a target.`);
		if (!this.can("mute", null, room)) return this.errorReply("Boi get slammed!");
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} used Body Slam on ${WL.nameColor(target, true, true)}!`);
		targetUser.popup("FUCKING BODIED!");
	},

	chal: function (target, room, user) {
		if (!target) return this.errorReply(`/chal needs a target.`);
		if (!this.can("mute", null, room)) return this.errorReply("Pffft your challenge meant nothing!");
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has challenged ${WL.nameColor(target, true, true)} to a battle!`);
		targetUser.popup("You were just challenged to a battle!");
	},

	rko: function (target, room, user) {
		if (!target) return this.errorReply(`/rko needs a target.`);
		if (!this.can("mute", null, room)) return this.errorReply(`Hey, you, you aren't tough enough to express the usage of this!`);
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has RKO'ed ${WL.nameColor(target, true, true)}!`);
		targetUser.popup("RKO OUTTA NOWHERE!");
	},

	whip: function (target, room, user) {
		if (!target) return this.errorReply(`/whip needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has whipped ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup(`|html|${WL.nameColor(user.name, true, true)} has whipped you.`);
	},

	smack: function (target, room, user) {
		if (!target) return this.errorReply(`/smack needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has smacked ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup(`|html|${WL.nameColor(user.name, true, true)} has just smacked you.`);
	},

	memed: function (target, room, user) {
		if (!target) return this.errorReply(`/memed needs a target.`);
		if (!this.can("declare")) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has memed ${WL.nameColor(targetUser, true, true)}.`);
		this.parse("/declare NIIIIICE MEEEEME");
	},

	banhammer: function (target, room, user) {
		if (!target) return this.errorReply(`/banhammer needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		if (!room.users[targetUser.userid]) return this.errorReply(`User "${targetUser.name}" is not in this room.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has given the hammer to ${WL.nameColor(target, true, true)}!`);
		targetUser.popup(`|html|<strong><font color="red"><font size="4">The Hammer has been dropped!</font></strong>`);
		if (user.userid === "insist" || user.userid === "mewth") this.parse(`/forcelogout ${targetUser}`);
		targetUser.leaveRoom(room.id);
	},

	"!rekt": true,
	rekt: function () {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<center><img src="http://i.imgur.com/C26ZRE6.gif" width="600" height="300"</center>`);
	},

	bombing: function (target, room, user) {
		if (!target) return this.errorReply(`/bombing needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} bombed ${WL.nameColor(target, true, true)}.`);
		targetUser.popup("The bomb has exploded");
	},

	noscope: function () {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<center><img src=http://stream1.gifsoup.com/view3/20140324/5006332/360-noscope-chicken-o.gif width="600" height="300"</center>`);
	},

	roflstomp: function (target, room, user) {
		if (!target) return this.errorReply(`/roflstomp needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has roflstomped ${WL.nameColor(target, true, true)}.`);
		targetUser.popup("GIT ROFLSTOMPED BOII!");
	},

	tip: function (target, room, user) {
		if (!target) return this.errorReply(`/tip needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has tipped their fedora to ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup("Someone has tipped their fedora to you.");
	},

	bow: function (target, room, user) {
		if (!target) return this.errorReply(`/bow needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has bowed to ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup("Someone has bowed to you.");
	},

	rekted: function (target, room, user) {
		if (!target) return this.errorReply(`/rekted needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has destroyed ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup("Someone has destroyed you.");
	},

	smite: function (target, room, user) {
		if (!target) return this.errorReply(`/smite needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has smited ${WL.nameColor(targetUser, true, true)} with their wrath.`);
		targetUser.popup("A GOD has made you feel their wrath.");
	},

	fired: function (target, room, user) {
		if (!target) return this.errorReply(`/fired needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} fired ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup("YOU HAVE BEEN FIRED!");
	},

	broke: function () {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<center><video src="http://r4---sn-ab5l6nzs.googlevideo.com/videoplayback?source=youtube&pl=24&mime=video/webm&ip=68.132.51.87&expire=1456788631&id=o-AHMd8ZLgKPboESCKb60dXCAAV6rjEC9Kof3-2-QQfdB8&keepalive=yes&upn=1M4ZMLLmG0w&key=cms1&fexp=9406852,9408491,9412845,9416126,9416985,9418223,9420452,9422596,9423661,9423662,9424037,9424135,9424772,9425780,9427245,9429055,9429087,9429505&clen=170856526&itag=242&dur=35995.760&signature=34DC47CC23F06F6F70A02FD47DE6DA98EE94D7C1.7185593359F397AC90C9498AD91CB6A09211E9E2&ipbits=0&sver=3&sparams=clen,dur,expire,gir,id,initcwndbps,ip,ipbits,itag,keepalive,lmt,mime,mm,mn,ms,mv,nh,pl,source,upn&lmt=1449590895266333&gir=yes&title=Windows-Error-Remix-10-Hours%20[BollyCine.Net]&redirect_counter=1&req_id=a7b35ef98b4ba3ee&cms_redirect=yes&mm=30&mn=sn-ab5l6nzs&ms=nxu&mt=1456766974&mv=m" controls"play/stop" width="400" height="300"></video></center>`);
	},

	dunked: function (target, room, user) {
		if (!target) return this.errorReply(`/dunked needs a target.`);
		if (!this.can("mute", null, room)) return user.popup(`NOU! GET DUNKED ON!`);
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} just dunked on ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup("GET DUNKED ON FOOL!!!!");
	},

	dank: function (target, room, user) {
		if (!target) return this.errorReply(`/dank needs a target.`);
		if (!this.can("mute", null, room)) return this.errorReply(`YOU AREN'T DANK ENOUGH!`);
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(targetUser, true, true)} has received a dank meme from ${WL.nameColor(user.name, true, true)}.`);
		targetUser.popup("You have received a dank meme (legend of zelda treasure found music plays).");
	},

	sans: function () {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<center>So I got a question for you.... do you think the worst person.. can change?<br /><img src="http://i.imgur.com/DPr9ifK.gif" height="50" width="50"><br />heh alright I have a better question... DO YOU WANNA HAVE A BAD TIME?!<br /><br /><audio src="https://dl.pushbulletusercontent.com/Jyh0owl5BR8rNmcQjFH9VlrQaDPKWCeT/Megalovania.mp3" controls=""></audio></center>`);
	},

	trump: function () {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<center><img src="http://cdn.buzzlie.com/wp-content/uploads/2015/11/54a07996c8f1c37f77be418079ae352a.jpg" height="300" width="300"><br /></center>`);
	},

	lenny: function () {
		this.parse(`( ͡° ͜ʖ ͡°)`);
	},

	sans2: function (target, room) {
		if (!target) return this.errorReply(`/sans2 needs a target.`);
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(targetUser, true, true)} JUST GOT DUNKED ON!!!!!`);
		targetUser.popup(`|html|<center><img src="http://lpix.org/2269600/4000.gif" height="300" width="300"</center><br />GEEEEEET DUNKED ON!!!`);
	},

	break: function (target, room, user) {
		if (!target) return this.errorReply(`/break needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has broken ${WL.nameColor(targetUser, true, true)}.`);
		targetUser.popup(`|html|${WL.nameColor(user.name, true, true)} has smashed you 2 bits.`);
	},

	swat: function (target, room, user) {
		if (!target) return this.errorReply(`/swat needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has swatted ${WL.nameColor(targetUser, true, true)} out of the sky.`);
	},

	donger: function (target, room, user) {
		if (!target) return this.errorReply(`/donger needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has begun a riot against ${WL.nameColor(targetUser, true, true)}.`);
		this.parse(`ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ`);
	},

	dongers: function (target, room, user) {
		if (!this.can("declare")) return false;
		if (room.isOfficial) return this.errorReply(`You cannot use this command in Official Chatrooms.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has begun a donger ambush.`);
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare ╚═། ◑ ▃ ◑ །═╝ do you like my dongers? ╚═། ◑ ▃ ◑ །═╝");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ I made my dongers just for you ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare (ノ͡° ͜ʖ ͡°)ノ︵┻┻ flip your dongers all around");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare ╚═། ◑ ▃ ◑ །═╝ do you like my dongers? ╚═། ◑ ▃ ◑ །═╝");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ I made my dongers just for you ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare (ノ͡° ͜ʖ ͡°)ノ︵┻┻ flip your dongers all around");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare ╚═། ◑ ▃ ◑ །═╝ do you like my dongers? ╚═། ◑ ▃ ◑ །═╝");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ I made my dongers just for you ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare (ノ͡° ͜ʖ ͡°)ノ︵┻┻ flip your dongers all around");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare ╚═། ◑ ▃ ◑ །═╝ do you like my dongers? ╚═། ◑ ▃ ◑ །═╝");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ I made my dongers just for you ᕙ༼ຈل͜ຈ༽ᕗ");
		this.parse("/declare (ノ͡° ͜ʖ ͡°)ノ︵┻┻ flip your dongers all around");
		this.parse("/declare ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ");
	},

	splat: function (target, room, user) {
		if (!target) return this.errorReply(`/splat needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${WL.nameColor(user.name, true, true)} has splatted ${Server.nameColor(targetUser, true, true)}.`);
		targetUser.popup("You were splatted by the Aerospray PG.");
	},

	roasted: function (target, room, user) {
		if (!target) return this.errorReply(`/roasted needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(user.name, true, true)} has burned  ${Server.nameColor(target, true, true)} (Better put some ice on that).`);
		targetUser.popup("My nigga you just got roasted.");
	},

	behave: function (target, room, user) {
		if (!target) return this.errorReply(`/behave needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(user.name, true, true)} has told ${Server.nameColor(target, true, true)} to get their shit together.`);
		targetUser.popup("Nigga Behave!");
	},

	bhunt: function (target, room, user) {
		if (!target) return this.errorReply(`/bhunt needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(user.name, true, true)} has hunted ${Server.nameColor(target, true, true)} for the booty.`);
		targetUser.popup("( ͡° ͜ʖ ͡°)Gimme That Booty( ͡° ͜ʖ ͡°)");
	},

	senpai: function (target, room, user) {
		if (!target) return this.errorReply(`/senpai needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(user.name, true, true)} has once again failed to notice ${Server.nameColor(targetUser, true, true)}.`);
		targetUser.popup("Senpai gives no shits about you.");
	},

	badtime: function (target, room) {
		if (!target) return this.errorReply(`/badtime needs a target.`);
		if (!this.can("mute", null, room)) return this.errorReply("kids like you should be burning in hell");
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(targetUser, true, true)} felt their sins crawling on their back.`);
		targetUser.popup(`Do you want to have a bad time?`);
	},

	bop: function (target, room, user) {
		if (!target) return this.errorReply(`/bop needs a target.`);
		if (!this.can("mute", null, room) && user.userid !== "noviex") return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(user.name, true, true)} has bopped ${Server.nameColor(target, true, true)} in the face!`);
	},

	burn: "disintegrate",
	disintegrate: function (target, room, user) {
		if (!target) return this.errorReply(`/burn needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(target, true, true)} was disintegrated by ${Server.nameColor(user.name, true, true)}!`);
		targetUser.popup("Get burned!");
		if (user.userid === "insist" || user.userid === "mewth") this.parse(`/forcelogout ${targetUser}`);
	},

	l: "loss",
	loss: function (target, room, user) {
		if (!target) return this.errorReply(`/loss needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(target, true, true)} took an L!`);
		if (user.userid === "insist" || user.userid === "mewth") this.parse(`/forcelogout ${targetUser}`);
	},

	shoot: "blast",
	blast: function (target, room, user) {
		if (!target) return this.errorReply(`/shoot needs a target.`);
		if (!this.can("mute", null, room)) return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(target, true, true)} was shot by ${Server.nameColor(user.name, true, true)}!`);
		if (user.userid === "insist" || user.userid === "mewth") this.parse(`/forcelogout ${targetUser}`);
	},

	cyn: "pix",
	pix: function (target, room, user) {
		if (!target) return this.errorReply(`/pix needs a target.`);
		if (!this.can("mute", null, room) && user.userid !== "littlemisspixiepix") return false;
		let targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.errorReply(`User "${targetUser}" was not found.`);
		room.addRaw(`${Server.nameColor(user.name, true, true)} has pixed ${Server.nameColor(target, true, true)} in the pixing pix! Pix that's gotta hurt!`);
		targetUser.popup("PIIIIIIIIIIIIIIIIXXXXXXXXXX");
	},

	randaction: "action",
	action: function (target, room, user) {
		if (!this.can("broadcast")) return false;
		let actions = ["slapped", "punched", "kicked", "humped", "fucked", "hugged", "was murdered by", "took an L from", "got an ass-eating from", "dropkicked", "ban-hammered", "got rejected by", "succ'd", "got succ'd by", "pummeled", "got a beating from", "kissed", "winked at", "was pet by", "stabbed", "insulted", "complimented", "furried", "fluffed", "sat on"];
		if (!target) return this.errorReply(`/action needs a target.`);
		let actionChoice = actions[Math.floor(Math.random() * actions.length)];
		room.addRaw(`${Server.nameColor(user.name, true, true)} ${actionChoice} ${Server.nameColor(target, true, true)}!`);
	},

	meme: "memes",
	memes: {
		add: function (target) {
			if (!this.can("lock")) return;
			let [name, img, height, width] = target.split(",").map(p => { return p.trim(); });
			if (!width) return this.parse(`/memeshelp`);
			if (name.length > 20) return this.errorReply(`Your name should be less than 20 characters long.`);
			if (memes[toId(name)]) return this.errorReply(`${name} is already registered as a meme!`);
			if (![".png", ".gif", ".jpg"].includes(img.slice(-4))) return this.errorReply(`The image needs to end in .png, .gif, or .jpg.`);
			if (height > 500 || height < 100 || width > 500 || width < 100) return this.errorReply(`Your height and width attributes should be less than 500 and more than 100.`);
			if (isNaN(height) || isNaN(width)) return this.errorReply(`Your height and width attributes must be a number!`);
			memes[toId(name)] = {
				name: name,
				id: toId(name),
				img: img,
				height: height,
				width: width,
			};
			write();
			return this.sendReplyBox(`Meme ${name} created!<br /><img src="${img}" alt="${name}" title="${name}" height="${height}" width="${width}">.`);
		},

		delete: "remove",
		clear: "remove",
		remove: function (target) {
			if (!this.can("lock")) return false;
			if (!target) return this.errorReply("This command requires a target.");
			let memeid = toId(target);
			if (!memes[memeid]) return this.errorReply(`${target} is not currently registered as a meme.`);
			delete memes[memeid];
			write();
			this.sendReply(`The meme "${target}" has been deleted.`);
		},

		list: function () {
			if (!this.runBroadcast()) return;
			if (Object.keys(memes).length < 1) return this.errorReply(`There are no memes on ${Config.serverName}.`);
			let reply = `<strong><u>Memes (${Object.keys(memes).length.toLocaleString()})</u></strong><br />`;
			for (let meme in memes) reply += `(<strong>${meme}</strong>) <button class="button" name="send" value="/meme show ${meme}">View ${meme}</button><br />`;
			this.sendReplyBox(reply);
		},

		show: "display",
		display: function (target, room, user) {
			if (!this.runBroadcast()) return;
			if (Object.keys(memes).length < 1) return this.errorReply(`There are no memes on ${Config.serverName}.`);
			if (!target) {
				let randMeme = Object.keys(memes)[Math.floor(Math.random() * Object.keys(memes).length)];
				let title = memes[randMeme].name;
				let randMemeImg = memes[randMeme].img;
				let randMemeH = memes[randMeme].height;
				let randMemeW = memes[randMeme].width;
				this.sendReplyBox(`Random Meme "${title}": <img src="${randMemeImg}" alt="${title}" title="${title}" height="${randMemeH}" width="${randMemeW}">`);
			} else {
				let memeid = toId(target);
				if (!memes[memeid]) return this.errorReply("That meme does not exist.");
				let name = memes[memeid].name;
				let img = memes[memeid].img;
				let height = memes[memeid].height;
				let width = memes[memeid].width;
				this.sendReplyBox(`${name}:<br /> <img src="${img}" alt="${name}" title="${name}" height="${height}" width="${width}">`);
			}
		},

		"": "help",
		help: function () {
			this.parse(`/memeshelp`);
		},
	},

	memeshelp: [
		`/memes add [name], [height], [width] - Adds a meme into the index. Requires Lock Access.
		/memes delete [name] - Removes a meme from the index. Requires Lock Access.
		/memes list - Shows all the memes in the index.
		/memes show [optional meme name] - Shows the specified meme. If no target is specified, randomly displays a meme.
		/memes help - Shows this command.`,
	],
};
