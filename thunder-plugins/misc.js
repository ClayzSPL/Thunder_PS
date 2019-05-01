/**
 * Miscellaneous commands
 *
*
 * @license MIT license
 */
'use strict';

let FS = require('../lib/fs');

let monData;

try {
	monData = FS("data/wlssb-data.txt").readIfExistsSync().toString().split("\n\n");
} catch (e) {
	console.error(e);
}

function getMonData(target) {
	let returnData = null;
	if (!monData) return 'Data not found';
	monData.forEach(function (data) {
		if (toId(data.split("\n")[0].split(" - ")[0] || " ") === target) {
			returnData = data.split("\n").map(function (line) {
				return Chat.escapeHTML(line);
			}).join("<br />");
		}
	});
	return returnData;
}

function clearRoom(room) {
	let len = (room.log.log && room.log.log.length) || 0;
	let users = [];
	while (len--) {
		room.log.log[len] = '';
	}
	for (let u in room.users) {
		users.push(u);
		Users(u).leaveRoom(room, Users(u).connections[0]);
	}
	len = users.length;
	setTimeout(() => {
		while (len--) {
			Users(users[len]).joinRoom(room, Users(users[len]).connections[0]);
		}
	}, 1000);
}

exports.commands = {
	arlert: 'alert',	
	alert: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target || !targetUser) return this.sendReply("/alert user, message: Sends a popup to a user. Requires &~");
		if (!targetUser || !targetUser.connected) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		msg = Tools.escapeHTML(user.name) + " has sent you an alert (" + new Date().toUTCString() + "): " + target;
		if (target.length > 500) return this.sendReply("ERROR - alert is too long.");
		if (!targetUser.connected) return this.sendReply(targetUser + " not found.  Check spelling?");
		targetUser.popup(msg);
	},
	useroftheweek: "uotw",
	uotw: function (target, room, user) {
		if (toId(target.length) >= 19) return this.errorReply("Usernames have to be 18 characters or less");
		if (!this.can("mute", null, room)) return false;
		if (!room.chatRoomData) return;
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.chatRoomData.user) return this.errorReply("The User of the Week has not been set.");
			return this.sendReplyBox(`The current <strong>User of the Week</strong> is: ${Server.nameColor(room.chatRoomData.user, true)}`);
		}
		if (this.meansNo(target)) {
			if (!room.chatRoomData.user) return this.errorReply("The User of the Week has already been reset.");
			delete room.chatRoomData.user;
			this.sendReply(`The User of the Week was reset by ${Server.nameColor(user.name, true)}.`);
			this.addModAction(`UOTW Reset: ${user.name} reset the User of the Week.`);
			Rooms.global.writeChatRoomData();
			return;
		}
		room.chatRoomData.user = Chat.escapeHTML(target);
		Rooms.global.writeChatRoomData();
		room.addRaw(`<div class="broadcast-green"><strong>The User of the Week is: ${Server.nameColor(room.chatRoomData.user, true)}.</strong></div>`);
		this.addModAction(`${user.name} updated the User of the Week to "${room.chatRoomData.user}".`);
	},
	useroftheweekhelp: "uotwhelp",
	uotwhelp: [
		`/uotw - View the current User of the Week.
		/uotw [user] - Set the User of the Week. Requires: % or higher.`,
	],

	etour: function (target) {
		if (!target) return this.parse("/help etour");
		this.parse(`/tour create ${target}, elimination`);
	},
	etourhelp: ["/etour [format] - Creates an elimination tournament."],

	rtour: function (target) {
		if (!target) return this.parse("/help rtour");
		this.parse(`/tour create ${target}, roundrobin`);
	},
	rtourhelp: ["/rtour [format] - Creates a round robin tournament."],

	autovoice: "autorank",
	autodriver: "autorank",
	automod: "autorank",
	autoowner: "autorank",
	autopromote: "autorank",
	autorank: function (target, room, user, connection, cmd) {
		switch (cmd) {
		case "autovoice":
			target = "+";
			break;
		case "autodriver":
			target = "%";
			break;
		case "automod":
			target = "@";
			break;
		case "autoleader":
			target = "&";
			break;
		case "autoowner":
			target = "#";
			break;
		}

		if (!target) return this.parse("/autorankhelp");
		if (!this.can("roommod", null, room)) return false;
		if (room.isPersonal) return this.errorReply("Autorank is not currently a feature in groupchats.");
		target = target.trim();

		if (this.meansNo(target) && room.autorank) {
			delete room.autorank;
			delete room.chatRoomData.autorank;
			Rooms.global.writeChatRoomData();
			for (let u in room.users) Users(u).updateIdentity();
			return this.privateModAction(`(${user.name} has disabled autorank in this room.)`);
		}
		if (room.autorank && room.autorank === target) return this.errorReply(`Autorank is already set to "${target}".`);

		if (Config.groups[target] && !Config.groups[target].globalonly) {
			if (target === "#" && user.userid !== room.founder) return this.errorReply("You can't set autorank to # unless you're the room founder.");
			room.autorank = target;
			room.chatRoomData.autorank = target;
			Rooms.global.writeChatRoomData();
			for (let u in room.users) Users(u).updateIdentity();
			return this.privateModAction(`(${user.name} has set autorank to "${target}" in this room.)`);
		}
		return this.errorReply(`Group "${target}" not found.`);
	},
	autorankhelp: ["/autorank [rank] - Automatically promotes user to the specified rank when they join the room."],

	bonus: "dailybonus",
	checkbonus: "dailybonus",
	dailybonus: function (target, room, user) {
		let nextBonus = Date.now() - Db.DailyBonus.get(user.userid, [1, Date.now()])[1];
		if ((86400000 - nextBonus) <= 0) return Server.giveDailyReward(user.userid, user);
		return this.errorReply(`Your next bonus is ${(Db.DailyBonus.get(user.userid, [1, Date.now()])[0] === 8 ? 7 : Db.DailyBonus.get(user.userid, [1, Date.now()])[0])} ${(Db.DailyBonus.get(user.userid, [1, Date.now()])[0] === 1 ? moneyName : moneyPlural)} in ${Chat.toDurationString(Math.abs(86400000 - nextBonus))}`);
	},

	clearall: function (target, room, user) {
		if (!this.can('lockdown')) return false;
		if (room.battle) return this.sendReply("You cannot clearall in battle rooms.");

		clearRoom(room);

		this.modlog(`CLEARALL`);
		this.privateModAction(`(${user.name} used /clearall.)`);
	},

	gclearall: 'globalclearall',
	globalclearall: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.rooms.forEach(room => clearRoom(room));
		Users.users.forEach(user => user.popup('All rooms have been cleared.'));
		this.modlog(`GLOBALCLEARALL`);
		this.privateModAction(`(${user.name} used /globalclearall.)`);
	},

	contact: 'whotocontact',
	wtc: 'whotocontact',
	whotocontact: function (target, room, user) {
		return this.sendReplyBox(
			'<b><u><font color="#008ae6"><h2>Who to Contact</u></b></font></h2>' +
			'<h3>For those who don\'t exactly know who to contact about a certain situation, this guide will help you contact the right person!</h3>' +
			'<hr>' +
			'<b>Global Drivers (%):</b> - Its best to contact a Global Driver if there are any forms of trolling, spamming, or severely negative behavior. If you ever witness this, please contact them as soon as possible. <br />' +
			'<hr>' +
			'<b>Global Moderators (@)</b> - Normally if there are multiple spammers, Global Mods can be contacted to resolve the issue.  <br />' +
			'<hr>' +
			'<b>Global Leaders (&)</b> - Its best to contact a Leader if there are any issues with Global Auth or Room Owners. It is up to the Leaders to make the final decision of any situation reported. At the same time, they also handle requests on appointing Room Owners and creating/deleting a room. <br />' +
			'<hr>' +
			'<b>Administrators (~)</b> - Administrators are to be contacted if there is a serious issue. This may include sexual harrassment and/or abuse of power from Room Owners as well as Global Staff. Its also important to contact Administrators if there are any bugs within the server system that need to be looked at.  <br />'
		);
	},

	roomlist: function (target, room, user) {
		let header = ['<b><font color="#1aff1a" size="2">Total users connected: ' + Rooms.global.userCount + '</font></b><br />'],
			official = ['<b><font color="#ff9900" size="2"><u>Official Rooms:</u></font></b><br />'],
			nonOfficial = ['<hr><b><u><font color="#005ce6" size="2">Public Rooms:</font></u></b><br />'],
			privateRoom = ['<hr><b><u><font color="#ff0066" size="2">Private Rooms:</font></u></b><br />'],
			groupChats = ['<hr><b><u><font color="#00b386" size="2">Group Chats:</font></u></b><br />'],
			battleRooms = ['<hr><b><u><font color="#cc0000" size="2">Battle Rooms:</font></u></b><br />'];

		let rooms = [];

		Rooms.rooms.forEach(curRoom => {
			if (curRoom.id !== 'global') rooms.push(curRoom.id);
		});

		rooms.sort();

		for (let u in rooms) {
			let curRoom = Rooms(rooms[u]);
			if (curRoom.modjoin) {
				if (Config.groupsranking.indexOf(curRoom.modjoin) > Config.groupsranking.indexOf(user.group)) continue;
			}
			if (curRoom.isPrivate === true && !user.can('makeroom')) continue;
			if (curRoom.type === 'battle') {
				battleRooms.push('<a href="/' + curRoom.id + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
			}
			if (curRoom.type === 'chat') {
				if (curRoom.isPersonal) {
					groupChats.push('<a href="/' + curRoom.id + '" class="ilink">' + curRoom.id + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isOfficial) {
					official.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isPrivate) {
					privateRoom.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
			}
			if (curRoom.type !== 'battle') nonOfficial.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + curRoom.title + '</a> (' + curRoom.userCount + ')');
		}

		if (!user.can('lock')) return this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' '));
		this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' ') + (groupChats.length > 1 ? groupChats.join(' ') : '') + (battleRooms.length > 1 ? battleRooms.join(' ') : ''));
	},

	hide: 'hideauth',
	hideauth: function (target, room, user) {
		if (!user.can('lock')) return this.sendReply("/hideauth - Access Denied.");
		let tar = ' ';
		if (target) {
			target = target.trim();
			if (Config.groupsranking.indexOf(target) > -1 && target !== '#') {
				if (Config.groupsranking.indexOf(target) <= Config.groupsranking.indexOf(user.group)) {
					tar = target;
				} else {
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			} else {
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}
		user.customSymbol = tar;
		user.updateIdentity();
		this.sendReply('You are now hiding your auth symbol as \'' + tar + '\'.');
	},
	hidehelp: ["/hide - Hides user's global rank. Requires: & ~"],

	show: 'showauth',
	showauth: function (target, room, user) {
		if (!user.can('lock')) return this.sendReply("/showauth - Access Denied.");
		user.customSymbol = false;
		user.updateIdentity();
		this.sendReply("You have now revealed your auth symbol.");
		this.sendReply("Your symbol has been reset.");
	},
	showhelp: ["/show - Displays user's global rank. Requires: & ~"],

	credits: function (target, room, user) {
		let popup = "|html|" + "<font size=5 color=#0066ff><u><b>Thunder Credits</b></u></font><br />" +
			"<br />" +
			"<u><b>Thunder Maintainers:</u></b><br />" +
			"- " + WL.nameColor('Light 2.2', true) + " (Tenichal Administrator, Owner, Developer)<br />" +
			"- " + WL.nameColor('Zeruora', true) + " (Owner, Policy Head, Developer)<br />" +
			"<br />" +
			"<u><b>Major Contributors:</b></u><br />" +
			"- " + WL.nameColor('Zefras', true) + " (Developer)<br />" +
			"- " + WL.nameColor('Delta (summer)', true) + " (Community Admin)<br />" +
			"<u><b>Special Thanks:</b></u><br />" +
			"- Our Staff Members<br />" +
			"- Our Regular Users<br />";
		user.popup(popup);
	},
	randomsurvey: "randsurvey",
	randsurvey: function () {
		let results = [
			`/survey create What do you want to see added or updated in ${Config.serverName}?`,
			`/survey create What's your most memorable experience on ${Config.serverName}?`,
			`/survey create How much time do you spend on ${Config.serverName} daily?`,
			`/survey create What is your favorite custom mechanic on ${Config.serverName}?`,
			`/survey create Was ${Config.serverName} your first Pokemon Showdown side-server?`, //5
			`/survey create Do you like the league system?`,
			`/survey create Do you like the idea of us adding custom megas on ${Config.serverName} that you can use in regular formats? (OU, UU, Ubers, Etc)`,
			`/survey create What was your worst experience so far on ${Config.serverName}?`,
			`/survey create What's your favorite food?`,
			`/survey create What's your favorite activity on a hot summer day?`, //10
			`/survey create What's your favorite drink`,
			`/survey create What's your favorite color?`,
			`/survey create What's the most embarrassing thing that's ever happened to you in real life?`,
			`/survey create Have you ever been banned/locked on main? (play.pokemonshowdown.com)`,
			`/survey create Do you want to see more events on ${Config.serverName}?`, //15
		];
		return this.parse(results[Math.floor(Math.random() * results.length)]);
	},
"!m8b": true,
	helixfossil: "m8b",
	helix: "m8b",
	magic8ball: "m8b",
	m8b: function () {
		if (!this.runBroadcast()) return;
		let results = ["Signs point to yes.", "Yes.", "Reply hazy, try again.", "Without a doubt.", "My sources say no.", "As I see it, yes.", "You may rely on it.", "Concentrate and ask again.", "Outlook not so good.", "It is decidedly so.", "Better not tell you now.", "Very doubtful.", "Yes - definitely.", "It is certain.", "Cannot predict now.", "Most likely.", "Ask again later.", "My reply is no.", "Outlook good.", "Don't count on it."];
		return this.sendReplyBox(results[Math.floor(Math.random() * results.length)]);
	},

	rk: 'kick',
	roomkick: 'kick',
	kick: function (target, room, user) {
		if (!target) return this.parse('/help kick');
		if (!this.canTalk() && !user.can('bypassall')) {
			return this.sendReply("You cannot do this while unable to talk.");
		}

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (target.length > 300) return this.errorReply("The reason is too long. It cannot exceed 300 characters.");
		if (!targetUser || !targetUser.connected) return this.sendReply("User \"" + this.targetUsername + "\" not found.");
		if (!this.can('mute', targetUser, room)) return false;
		if (!room.users[targetUser.userid]) return this.errorReply("User \"" + this.targetUsername + "\" is not in this room.");

		this.modlog(`ROOMKICK`, targetUser, target);
		this.addModAction(`${targetUser.name} was kicked from the room by ${user.name}.${target.trim() ? ` (${target})` : ``}`);
		targetUser.popup(`"You were kicked from ${room.id} by ${user.name}.${target.trim() ? ` (${target})` : ``}`);
		targetUser.leaveRoom(room.id);
	},
	kickhelp: ["/kick - Kick a user out of a room. Requires: % @ # & ~"],

	masspm: 'pmall',
	pmall: function (target, room, user) {
		if (!this.can('pmall')) return false;
		if (!target) return this.parse('/help pmall');

		let pmName = ' WL Server';
		Users.users.forEach(curUser => {
			let message = '|pm|' + pmName + '|' + curUser.getIdentity() + '|' + target;
			curUser.send(message);
		});
	},
	pmallhelp: ["/pmall [message]."],

	staffpm: 'pmallstaff',
	pmstaff: 'pmallstaff',
	pmallstaff: function (target, room, user) {
		if (!this.can('pmall')) return false;
		if (!target) return this.parse('/help pmallstaff');

		let pmName = ' WL Server';

		Users.users.forEach(curUser => {
			if (!curUser.isStaff) return;
			let message = '|pm|' + pmName + '|' + curUser.getIdentity() + '|' + target;
			curUser.send(message);
		});
	},
	pmallstaffhelp: ["/pmallstaff [message]"],

	hc: function (target, room, user) {
		return this.parse('/hotpatch chat');
	},

	hf: function (target, room, user) {
		return this.parse('/hotpatch formats');
	},

	hb: function (target, room, user) {
		return this.parse('/hotpatch battles');
	},

	hv: function (target, room, user) {
		return this.parse('/hotpatch validator');
	},

	hw: function (target, room, user) {
		return this.parse('/hotpatch wavelength');
	},

	'!regdate': true,
	regdate: function (target, room, user, connection) {
		if (!target) target = user.name;
		target = toId(target);
		if (target.length < 1 || target.length > 19) {
			return this.sendReply("Usernames can not be less than one character or longer than 19 characters. (Current length: " + target.length + ".)");
		}
		if (!this.runBroadcast()) return;
		WL.regdate(target, date => {
			if (date) {
				this.sendReplyBox(regdateReply(date));
			}
		});

		function regdateReply(date) {
			if (date === 0) {
				return WL.nameColor(target, true) + " <b><font color='red'>is not registered.</font></b>";
			} else {
				let d = new Date(date);
				let MonthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December",
				];
				let DayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				return WL.nameColor(target, true) + " was registered on <b>" + DayNames[d.getUTCDay()] + ", " + MonthNames[d.getUTCMonth()] + ' ' + d.getUTCDate() + ", " + d.getUTCFullYear() + "</b> at <b>" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC.</b>";
			}
			//room.update();
		}
	},
	regdatehelp: ["/regdate - Gets the regdate (register date) of a username."],

	uor: 'usersofrank',
	usersofrank: function (target, room, user) {
		if (!target || !Config.groups[target]) return false;
		if (!this.runBroadcast()) return;
		let names = [];
		Users.users.forEach(user => {
			if (user.group === target) {
				names.push(user.name);
			}
		});
		names = names.sort();
		if (names.length < 1) return this.sendReplyBox('There are no users of the rank <font color="#24678d"><b>' + Chat.escapeHTML(Config.groups[target].name) + '</b></font> currently online.');
		return this.sendReplyBox('There ' + (names.length === 1 ? 'is' : 'are') + ' <font color="#24678d"><b>' + names.length + '</b></font> ' + (names.length === 1 ? 'user' : 'users') + ' with the rank <font color="#24678d"><b>' + Config.groups[target].name + '</b></font> currently online.<br />' + names.join(', '));
	},

	'!thunderrepo': true,
	repo: 'thunderrepo',
	thunderrepo: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReply(`|raw|<a href="https://github.com/BaneOfAll/Thunder_PS">Thunder's repo</a>`);
	},
	thunderrepohelp: ["/thunderrepo - Links to the Thunder repository on Github."],

	'!seen': true,
	seen: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help seen');
		let targetUser = Users.get(target);
		if (targetUser && targetUser.connected) return this.sendReplyBox(WL.nameColor(targetUser.name, true) + " is <b><font color='limegreen'>Currently Online</b></font>.");
		target = Chat.escapeHTML(target);
		let seen = Db.seen.get(toId(target));
		if (!seen) return this.sendReplyBox(WL.nameColor(target, true) + " has <b><font color='red'>never been online</font></b> on this server.");
		this.sendReplyBox(WL.nameColor(target, true) + " was last seen <b>" + Chat.toDurationString(Date.now() - seen, {precision: true}) + "</b> ago.");
	},
	seenhelp: ["/seen - Shows when the user last connected on the server."],

	tell: function (target, room, user, connection) {
		if (!target) return this.parse('/help tell');
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!target) {
			this.sendReply("You forgot the comma.");
			return this.parse('/help tell');
		}

		if (targetUser && targetUser.connected) {
			return this.parse('/pm ' + this.targetUsername + ', ' + target);
		}

		if (user.locked) return this.popupReply("You may not send offline messages when locked.");
		if (target.length > 255) return this.popupReply("Your message is too long to be sent as an offline message (>255 characters).");

		if (Config.tellrank === 'autoconfirmed' && !user.autoconfirmed) {
			return this.popupReply("You must be autoconfirmed to send an offline message.");
		} else if (!Config.tellrank || Config.groupsranking.indexOf(user.group) < Config.groupsranking.indexOf(Config.tellrank)) {
			return this.popupReply("You cannot send an offline message because offline messaging is " +
				(!Config.tellrank ? "disabled" : "only available to users of rank " + Config.tellrank + " and above") + ".");
		}

		let userid = toId(this.targetUsername);
		if (userid.length > 18) return this.popupReply("\"" + this.targetUsername + "\" is not a legal username.");

		let sendSuccess = Tells.addTell(user, userid, target);
		if (!sendSuccess) {
			if (sendSuccess === false) {
				return this.popupReply("User " + this.targetUsername + " has too many offline messages queued.");
			} else {
				return this.popupReply("You have too many outgoing offline messages queued. Please wait until some have been received or have expired.");
			}
		}
		return connection.send('|pm|' + user.getIdentity() + '|' +
			(targetUser ? targetUser.getIdentity() : ' ' + this.targetUsername) +
			"|/text This user is currently offline. Your message will be delivered when they are next online.");
	},
	tellhelp: ["/tell [username], [message] - Send a message to an offline user that will be received when they log in."],

	usetoken: function (target, room, user, connection, cmd, message) {
		target = target.split(',');
		if (target.length < 2) return this.parse('/help usetoken');
		target[0] = toId(target[0]);
		if (target[0] === 'intro') target[0] = 'disableintroscroll';
		if (target[0] === 'shop') target[0] = 'roomshop';
		let msg = '';
		if (['avatar', 'declare', 'icon', 'color', 'emote', 'title', 'disableintroscroll', 'music', 'background', 'roomshop'].indexOf(target[0]) === -1) return this.parse('/help usetoken');
		if (!user.tokens || !user.tokens[target[0]] && !user.can('bypassall')) return this.errorReply('You need to buy this from the shop first.');
		target[1] = target[1].trim();

		switch (target[0]) {
		case 'avatar':
			if (!['.png', '.gif', '.jpg'].includes(target[1].slice(-4))) return this.errorReply(`The image needs to end in .png, .gif, or .jpg`);
			msg = `/html <center>${WL.nameColor(user.name, true)} has redeemed a avatar token.<br/><img src="${target[1]}" alt="avatar"/><br/>`;
			msg += `<button class="button" name="send" value="/customavatar set ${user.userid}, ${target[1]}">Apply Avatar</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'declare':
			target[1] = target[1].replace(/<<[a-zA-z]+>>/g, match => {
				return `«<a href='/${toId(match)}'>${match.replace(/[<<>>]/g, '')}</a>»`;
			});
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a global declare token.<br/> Message: ${Chat.escapeHTML(target[1])}<br/>`;
			msg += `<button class="button" name="send" value="/globaldeclare ${target[1]}">Globally Declare the Message</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'color':
			if (target[1].substring(0, 1) !== '#' || target[1].length !== 7) return this.errorReply(`Colors must be a 6 digit hex code starting with # such as #009900`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a custom color token.<br/> Hex color: ${target[1]}<br/>`;
			msg += `<button class="button" name="send" value="/customcolor set ${user.name}, ${target[1]}">Set color (<b><font color="${target[1]}">${target[1]}</font></b>)</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'icon':
			if (!['.png', '.gif', '.jpg'].includes(target[1].slice(-4))) return this.errorReply(`The image needs to end in .png, .gif, or .jpg`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a icon token.<br/><img src="${target[1]}" alt="icon"/><br/>`;
			msg += `<button class="button" name="send" value="/customicon set ${user.userid}, ${target[1]}">Apply icon</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'title':
			if (!target[2]) return this.errorReply('/usetoken title, [name], [hex code]');
			target[2] = target[2].trim();
			if (target[1].substring(0, 1) !== '#' || target[1].length !== 7) return this.errorReply(`Colors must be a 6 digit hex code starting with # such as #009900`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a title token.<br/> Title name: ${target[1]}<br/>`;
			msg += `<button class="button" name="send" value="/customtitle set ${user.userid}, ${target[1]}, ${target[2]}">Set title (<b><font color="${target[2]}">${target[2]}</font></b>)</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'emote':
			if (!target[2]) return this.errorReply('/usetoken emote, [name], [img]');
			target[2] = target[2].trim();
			if (!['.png', '.gif', '.jpg'].includes(target[2].slice(-4))) return this.errorReply(`The image needs to end in .png, .gif, or .jpg`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a emote token.<br/><img src="${target[2]}" alt="${target[1]}"/><br/>`;
			msg += `<button class="button" name="send" value="/emote add ${target[1]}, ${target[2]}">Add emote</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'disableintroscroll':
			if (!target[1]) return this.errorReply('/usetoken disableintroscroll, [room]');
			let roomid = toId(target[1]);
			if (!Rooms(roomid)) return this.errorReply(`${roomid} is not a room.`);
			if (Db.disabledScrolls.has(roomid) || room.isOfficial) return this.errorReply(`${Rooms(roomid).title} has already roomintro scroll disabled.`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed roomintro scroll disabler token.<br/>`;
			msg += `<button class="button" name="send" value="/disableintroscroll ${target[1]}">Disable Intro Scroll for <b>${Rooms(roomid).title}</b></button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'background':
			if (!target[1]) return this.errorReply('/usetoken background, [img]');
			target[1] = target[1].trim();
			if (!['.png', '.gif', '.jpg'].includes(target[1].slice(-4))) return this.errorReply(`The image needs to end in .png, .gif, or .jpg`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a background token.<br/><img src="${target[1]}/><br/>`;
			msg += `<button class="button" name="send" value="/background set ${user.userid}, ${target[1]}">Set the background</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'music':
			if (!target[2]) return this.errorReply('/usetoken music, [link], [name]');
			target[1] = target[1].trim();
			if (!['.mp3', '.mp4', '.m4a'].includes(target[1].slice(-4))) return this.errorReply(`The song needs to end in .mp3, .mp4, or .m4a`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a music token.<br/><audio src="${target[2]}" alt="${target[1]}"></audio><br/>`;
			msg += `<button class="button" name="send" value="/music set ${user.userid}, ${target[1]}, ${target[2]}">Set music</button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case "roomshop":
			if (!target[1]) return this.errorReply("/usetoken roomshop, [room name]");
			if (!Rooms(roomid)) return this.errorReply(`${roomid} is not a room.`);
			if (Db.roomshop.has(roomid)) return this.errorReply(`${roomid} already has a Room Shop.`);
			msg += `/html <center>${WL.nameColor(user.name, true)} has redeemed a Room Shop token.<br />`;
			msg += `<button class="button" name="send" value="/roomshop ${target[1]}">Create Room <strong>"${target[1]}"</strong></button></center>`;
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		default:
			return this.errorReply('An error occured in the command.'); // This should never happen.
		}
	},
	usetokenhelp: [
		'/usetoken [token], [argument(s)] - Redeems a token from the shop. Accepts the following arguments: ',
		'/usetoken avatar, [image] | /usetoken declare, [message] | /usetoken color, [hex code]',
		'/usetoken icon [image] | /usetoken title, [name], [hex code] | /usetoken emote, [name], [image]',
		'/usetoken disableintroscroll [room name] | /usetoken background, [img] | /usetoken music, [song], [name] | /usetoken roomshop, [room name]',
	],

	bonus: 'dailybonus',
	checkbonus: 'dailybonus',
	dailybonus: function (target, room, user) {
		let obj = Db.DailyBonus.get(user.latestIp, [1, Date.now()]);
		let nextBonus = Date.now() - obj[1];
		if ((86400000 - nextBonus) <= 0) return WL.giveDailyReward(user);
		return this.sendReply('Your next bonus is ' + obj[0] + ' ' + (obj[0] === 1 ? currencyName : currencyPlural) + ' in ' + Chat.toDurationString(Math.abs(86400000 - nextBonus)));
	},

	etour: function (target, room, user) {
		if (!target) return this.parse("/help etour");
		this.parse("/tour create " + target + ", elimination");
	},
	etourhelp: ["/etour [format] - Creates a single elimination tournament in the format provided."],

	rtour: function (target, room, user) {
		if (!target) return this.parse("/help rtour");
		this.parse("/tour create " + target + ", roundrobin");
	},
	rtourhelp: ["/rtour [format] - Creates a round robin tournament in the format provided."],

	disableintroscroll: function (target, room, user) {
		if (!this.can('makeroom')) return false;
		if (!target) return this.errorReply("No Room Specified");
		target = toId(target);
		if (!Rooms(target)) return this.errorReply(`${target} is not a room`);
		if (Db.disabledScrolls.has(target)) return this.errorReply(`${Rooms(target).title} has roomintro scroll disabled.`);
		Db.disabledScrolls.set(target, true);
		Monitor.adminlog(user.name + ` has disabled the roomintro scroll bar for ${Rooms(target).title}.`);
	},

	disableintroscrollhelp: ["/disableintroscroll [room] - Disables scroll bar preset in the room's roomintro."],
	enableintroscroll: function (target, room, user) {
		if (!this.can('makeroom')) return false;
		if (!target) return this.errorReply("No Room Specified");
		target = toId(target);
		if (!Rooms(target)) return this.errorReply(`${target} is not a room`);
		if (!Db.disabledScrolls.has(target)) return this.errorReply(`${Rooms(target).title} has roomintro scroll enabled.`);
		Db.disabledScrolls.remove(target);
		Monitor.adminlog(user.name + ` has enabled the roomintro scroll bar for ${Rooms(target).title}.`);
	},
	enableintroscrollhelp: ["/enableintroscroll [room] - Enables scroll bar preset in the room's roomintro."],

	
	pmroom: 'rmall',
	roompm: 'rmall',
	rmall: function (target, room, user) {
		if (!this.can('pmall', null, room)) return this.errorReply("/rmall - Access denied.");
		if (!target) return this.sendReply("/rmall [message] - Sends a pm to all users in the room.");
		target = target.replace(/<(?:.|\n)*?>/gm, '');

		let pmName = ' Thunder Server';

		for (let i in room.users) {
			let message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '| ' + target;
			room.users[i].send(message);
		}
		this.modlog(`MASSROOMPM`, null, target);
		this.privateModAction('(' + Chat.escapeHTML(user.name) + ' mass room PM\'ed: ' + target + ')');
	},

	fj: 'forcejoin',
	forcejoin: function (target, room, user) {
		if (!user.can('root')) return false;
		if (!target) return this.parse('/help forcejoin');
		let parts = target.split(',');
		if (!parts[0] || !parts[1]) return this.parse('/help forcejoin');
		let userid = toId(parts[0]);
		let roomid = toId(parts[1]);
		if (!Users.get(userid)) return this.sendReply("User not found.");
		if (!Rooms.get(roomid)) return this.sendReply("Room not found.");
		Users.get(userid).joinRoom(roomid);
	},
	forcejoinhelp: ["/forcejoin [target], [room] - Forces a user to join a room"],

	
	ac: 'autoconfirm',
	autoconfirm: function (target, room, user) {
		if (!this.can('lockdown')) return;
		if (!target) return this.parse(`/help autoconfirm`);
		let tarUser = Users(target);
		if (!tarUser) return this.errorReply(`User "${target} not found.`);
		if (tarUser.locked) return this.errorReply(`${tarUser.name} is locked and cannot be granted autoconfirmed status.`);
		if (tarUser.autoconfirmed) return this.errorReply(`${tarUser.name} is already autoconfirmed.`);
		let curType = Db.userType.get(tarUser.userid) || 0;
		if (curType) {
			switch (curType) {
			case 3:
				this.errorReply(`${tarUser.name} is a sysop and should already be autoconfirmed.`);
				break;
			case 4:
				this.errorReply(`${tarUser.name} is already set as autoconfirmed on this server.`);
				break;
			case 5:
			case 6:
				this.errorReply(`${tarUser.name} is ${(curType === 5 ? `permalocked on` : `permabanned from`)} this server and cannot be given autonconfirmed status.`);
			}
			return;
		}
		Db.userType.set(tarUser.userid, 4);
		tarUser.autoconfirmed = tarUser.userid;
		tarUser.popup(`|modal|${user.name} has granted you autoconfirmed status on this server only.`);
		return this.sendReply(`${tarUser.name} is now autonconfirmed.`);
	},
	autoconfirmhelp: ['/autoconfirm user - Grants a user autoconfirmed status on this server only. Requires ~'],

	usercodes: function (target, room, user) {
		if (!this.can('lockdown')) return;
		let out = `<div style="max-height: 300px; overflow: scroll">`;
		let keys = Db.userType.keys(), codes = {3: 'Thunder Sysop', 4: 'Autoconfirmed', 5: 'Permalocked', 6: 'Permabanned'};
		for (let i = 0; i < keys.length; i++) {
			out += `<b>${keys[i]}</b>: ${codes[Db.userType.get(keys[i])]}${(i + 1) === keys.length ? `` : `,<br/>`}`;
		}
		out += `</div>`;
		return this.sendReplyBox(out);
	},
};
