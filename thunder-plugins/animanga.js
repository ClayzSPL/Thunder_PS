'use strict';

const nani = require('nani').init("niisama1-uvake", "llbgsBx3inTdyGizCPMgExBVmQ5fU");

// Cache
let amCache = {
	anime: {},
	manga: {},
};

exports.commands = {
	anime: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.errorReply("No target.");
		let targetAnime = Chat.escapeHTML(target.trim());
		let id = targetAnime.toLowerCase().replace(/ /g, '');
		if (amCache.anime[id]) return this.sendReply('|raw|' + amCache.anime[id]);

		nani.get('anime/search/' + targetAnime)
			.then(data => {
				if (data[0].adult) {
					return this.errorReply('NSFW content is not allowed.');
				}
				nani.get('anime/' + data[0].id)
					.then(data => {
						let css = 'text-shadow: 1px 1px 1px #CCC; padding: 3px 8px;';
						let output = '<div class="infobox"><table width="100%"><tr>';
						let description = data.description.replace(/(\r\n|\n|\r)/gm, "").split('<br><br>').join('<br>');
						if (description.indexOf('&lt;br&gt;&lt;br&gt;') >= 0) description = description.substr(0, description.indexOf('&lt;br&gt;&lt;br&gt;'));
						if (description.indexOf('<br>') >= 0) description = description.substr(0, description.indexOf('<br>'));
						output += '<td style="' + css + ' background: rgba(170, 165, 215, 0.5); box-shadow: 2px 2px 5px rgba(170, 165, 215, 0.8); border: 1px solid rgba(170, 165, 215, 1); border-radius: 5px; color: #2D2B40; text-align: center; font-size: 15pt;"><strong>' + data.title_romaji + '</strong></td>';
						output += '<td rowspan="6"><img src="' + data.image_url_lge + '" height="320" width="225" alt="' + data.title_romaji + '" title="' + data.title_romaji + '" style="float: right; border-radius: 10px; box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.5), 1px 1px 2px rgba(255, 255, 255, 0.5) inset;" /></td></tr>';
						output += '<tr><td style="' + css + '"><strong>Genre(s): </strong>' + data.genres + '</td></tr>';
						output += '<tr><td style="' + css + '"><strong>Air Date: </strong>' + data.start_date.substr(0, 10) + '</td></tr><tr>';
						output += '<tr><td style="' + css + '"><strong>Status: </strong>' + data.airing_status + '</td></tr>';
						output += '<tr><td style="' + css + '"><strong>Episode Count: </strong>' + data.total_episodes + '</td></tr>';
						output += '<tr><td style="' + css + '"><strong>Rating: </strong> ' + data.average_score + '/100</td></tr>';
						output += '<tr><td colspan="2" style="' + css + '"><strong>Description: </strong>' + description + '</td></tr>';
						output += '</table></div>';
						amCache.anime[id] = output;
						this.sendReply('|raw|' + output);
						room.update();
					});
			})
			.catch(error => {
				return this.errorReply("Anime not found.");
			});
	},
	animehelp: ['/anime [query] - Searches for an anime series based on the given search query.'],

	manga: function (target, room) {
		if (!this.runBroadcast()) return;
		if (!target) return this.errorReply("No target.");
		let targetAnime = Chat.escapeHTML(target.trim());
		let id = targetAnime.toLowerCase().replace(/ /g, '');
		if (amCache.anime[id]) return this.sendReply('|raw|' + amCache.anime[id]);

		nani.get('manga/search/' + targetAnime)
			.then(data => {
				nani.get('manga/' + data[0].id)
					.then(data => {
						let css = 'text-shadow: 1px 1px 1px #CCC; padding: 3px 8px;';
						let output = '<div class="infobox"><table width="100%"><tr>';
						for (let i = 0; i < data.genres.length; i++) {
							if (/(Hentai|Yaoi|Ecchi)/.test(data.genres[i])) return this.errorReply('NSFW content is not allowed.');
						}
						let description = data.description.replace(/(\r\n|\n|\r)/gm, " ").split('<br><br>').join('<br>');
						if (description.indexOf('&lt;br&gt;&lt;br&gt;') >= 0) description = description.substr(0, description.indexOf('&lt;br&gt;&lt;br&gt;'));
						if (description.indexOf('<br>') >= 0) description = description.substr(0, description.indexOf('<br>'));
						output += '<td style="' + css + ' background: rgba(170, 165, 215, 0.5); box-shadow: 2px 2px 5px rgba(170, 165, 215, 0.8); border: 1px solid rgba(170, 165, 215, 1); border-radius: 5px; color: #2D2B40; text-align: center; font-size: 15pt;"><strong>' + data.title_romaji + '</strong></td>';
						output += '<td rowspan="6"><img src="' + data.image_url_lge + '" height="320" width="225" alt="' + data.title_romaji + '" title="' + data.title_romaji + '" style="float: right; border-radius: 10px; box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.5), 1px 1px 2px rgba(255, 255, 255, 0.5) inset;" /></td></tr>';
						output += '<tr><td style="' + css + '"><strong>Genre(s): </strong>' + data.genres + '</td></tr>';
						output += '<tr><td style="' + css + '"><strong>Release Date: </strong>' + data.start_date.substr(0, 10) + '</td></tr><tr>';
						output += '<tr><td style="' + css + '"><strong>Status: </strong>' + data.publishing_status + '</td></tr>';
						output += '<tr><td style="' + css + '"><strong>Chapter Count: </strong>' + data.total_chapters + '</td></tr>';
						output += '<tr><td style="' + css + '"><strong>Rating: </strong> ' + data.average_score + '/100</td></tr>';
						output += '<tr><td colspan="2" style="' + css + '"><strong>Description: </strong>' + description + '</td></tr>';
						output += '</table></div>';
						amCache.manga[id] = output;
						this.sendReply('|raw|' + output);
						room.update();
					});
			})
			.catch(error => {
				return this.errorReply("Manga not found.");
			});
	},
	mangahelp: ['/manga [query] - Searches for a manga series based on the given search query.'],
};
