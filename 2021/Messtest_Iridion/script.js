/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */

(function () {

    try {

        const getCookie = (name) => {
            var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            if (match) return decodeURIComponent(match[2]);
        };
        const push = (data) => {
            window.iridion.push(['goal', ...data]);
        };

        let iridion_user = getCookie('iridion_user');
        if (iridion_user) {
            iridion_user = JSON.parse(iridion_user);

            const iridion_session = getCookie('iridion_session');
            const emos_jcvid = getCookie('emos_jcvid');
            const { u: user_id } = iridion_user.find(o => o.u);
            const experiment_data = iridion_user.find(o => o.t === '1050098069313');
            const saved_data = JSON.parse(window.localStorage.kk21_messtest || false);

            if (experiment_data) {

                if (saved_data && saved_data.v !== experiment_data.v) {
                    push(['messtest_data',
                        [
                            Date.now(),
                            saved_data.user_id,
                            user_id,
                            iridion_session,
                            saved_data.emos,
                            emos_jcvid,
                            window.navigator.userAgent,
                            decodeURIComponent(saved_data.url),
                            decodeURIComponent(document.URL),
                            saved_data.v + '>' + experiment_data.v,
                            saved_data.ts,
                        ].join('||').replace(/,/g, '_-').replace(/:\/\//g, '_-/-/-').replace(/:/g, '_--')
                    ]);
                }

                window.localStorage.kk21_messtest = JSON.stringify({ emos: emos_jcvid, user_id, url: decodeURIComponent(document.URL), ...experiment_data, ts: Date.now() });
            }
        } else {
            push(['messtest_no_iridion_user']);
        }

    } catch (error) {
        window.iridion.push(['goal', 'messtest_error', error.toString()]);
    }
    // window.iridion.push(['goal', 'messtest_goal']);
    // window.iridion.push(['segment', '10070']);

})(window);