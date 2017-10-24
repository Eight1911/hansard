

announcementInfo : function(u){

			//if this is a course page, assemble the API call and call it
			var annurl;
			if (this.courseID && ENV && ENV.current_user_id) {
				if (u) {
					annurl = u;
				}else{
					annurl = "/api/v1/courses/" + this.courseID + "/discussion_topics?only_announcements=true";
				} 
				console.log("feed url is  "+annurl);
				$.get(annurl, this.displayAnnouncementInfo);
			}
		},

		annUnreadCount : 0,
		annList : [],
 
		// formats the Announcement into HTM, adds unread number to Left nav
		displayAnnouncementInfo : function(j, status, req){
			console.log("displayWidget callback");
			//first count the unread items and update the Announcment menu item
			var unread_count = 0;
			$.each(j, function(i, item) {
				$NEIT.annList.push(item);
				if (item && item.read_state && item.read_state == "unread") {
					$NEIT.annUnreadCount++;
				}
			});

			var pages = req.getResponseHeader("link");
			if (pages) {
				var links = $NEIT.parse_link_header(pages);
				var next = links["next"];
				if (next) {
					$NEIT.announcementInfo(next);
					return;
				}
			}

			if ($NEIT.annUnreadCount) {
				$('li.section a.announcements').append('<span id="annUnreadCount" title="Unread Announcements">'+$NEIT.annUnreadCount+'</span>')
			}

			//then see if this is a home page and do the widget assembly
			console.log("Checking if this is a home page");
			var el = $('#course_home_content');
			if (el.length || (ENV.WIKI_PAGE && ENV.WIKI_PAGE.front_page)){
				console.log("This is a home page");
				// is there a annuouncements div on the page?
				var annEl = $('#courseAnnouncementWidget');
				var annEl2 =  ENV.WIKI_PAGE ? $(ENV.WIKI_PAGE.body).siblings('#courseAnnouncementWidget') : '';
				if (!annEl.length){
					annEl = annEl2;
				}
				if (annEl.length == 0){
					console.log("No widget called for");
					return;
				}
 
				var annEl = $('#courseAnnouncementWidget');
				var annEl2 = ENV.WIKI_PAGE ? $(ENV.WIKI_PAGE.body).siblings('#courseAnnouncementWidget') : document.createElement('div');
				if (!annEl.length){
					annEl = annEl2;
				}
				var announcements = [];
				annEl.append("<div class='annWTitle'>Course Announcements</div>");
				$.each($NEIT.annList, function(i, item) {
					announcements.push({
						title: item.title,
						link: item.html_url,
						description: item.message,
						pubDate: new Date(item.delayed_post_at) > new Date(item.posted_at) ? new Date(item.delayed_post_at) : new Date(item.posted_at),
						//delayedDate: new Date(item.delayed_post_at),
						author: item.author.display_name
					});
				}); // .each
				announcements.sort(function( a, b ) {
					var aDate = a.pubDate.getTime(), bDate = b.pubDate.getTime();
					return aDate < bDate ? 1 : (aDate > bDate ? -1 : 0);
				});
				var count=0;
				announcements.forEach(function(el, i){
					var d = new Date(el.pubDate);
					if (d <= new Date() && count<=5) {
						var dateStr = d.toLocaleString().replace(/:\d{2}\s/,' ');
						annEl.append("<div class='annItem'><div class='annWTitle'><a href='"+announcements[i].link+"'>"+announcements[i].title+"</a></div><div class='annTimestamp'>"+dateStr+"</div><div class='annBody'>"+announcements[i].description+"</div></div>");
						count++;
					}
				});
				annEl.append("<div id='allAnnLink'><A href='/courses/"+$NEIT.courseID+"/announcements'>All announcements...</a></div>");
			}
