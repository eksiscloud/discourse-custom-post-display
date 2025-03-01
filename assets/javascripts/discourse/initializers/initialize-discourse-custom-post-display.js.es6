import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";
import { schedule } from "@ember/runloop";
import { makeArray } from "discourse-common/lib/helpers";
import { helperContext } from "discourse-common/lib/helpers";
const { iconNode } = require("discourse-common/lib/icon-library");

export default {
  name: "discourse-custom-post-display-plugin",

  initialize() {
    withPluginApi("0.8.25", (api) => {
      const siteSettings = api.container.lookup("site-settings:main");
      api.includePostAttributes('user_post_count', 'user_likes_received', 'user_join_date', 'user_badges');

      api.decorateWidget("poster-name:after", helper => {
        var badgeEls = [];
        if (typeof helper.attrs.user_badges !== 'undefined') {
          helper.attrs.user_badges.forEach(function(badge) {
            badgeEls.push(
              helper.h(
                'span',
                { className: `cpd-badge cpd-badge-${badge.id} cpd-badge-${badge.slug}` },
                helper.h(
                  'a',
                  {
                    href: `/badges/${badge.id}/${badge.slug}`,
                    title: badge.name
                  },
                  iconNode(badge.icon.replace("fa-", ""))
                )
              )
            );
          });
        }
        const els = [
          iconNode('calendar-days', {'class': 'cpd-join-date-icon', title: 'Join Date'}),
          helper.h('span', { className: 'cpd-text cpd-join-date', title: 'Join Date'}, '' + helper.attrs.user_join_date),
          iconNode('pen-to-square', {'class': 'cpd-post-count-icon', title: 'Posts Written'}),
          helper.h('span', { className: 'cpd-text cpd-post-count', title: 'Posts Written'}, '' + helper.attrs.user_post_count),
          iconNode('thumbs-up', {'class': 'cpd-likes-received-icon', title: 'Likes Received'}),
          helper.h('span', { className: 'cpd-text cpd-likes-received', title: 'Likes Received' }, '' + helper.attrs.user_likes_received),
        ];
        return helper.h(
          "div.cpd-container",
          {
          },
          helper.h(
            'a',
            {
              href: siteSettings.custom_post_display_help_url,
              title: 'Join Date, Posts Written, Likes Received'
            },
            helper.h('span.cpd-span',
              badgeEls.concat(els)
            )          
          )
        );
      });
    });
  },
};
