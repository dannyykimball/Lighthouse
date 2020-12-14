(function getClassPosts($) {
    var classPosts = $('.post-container');
    var classList = $('.class-list');
    classList.find('li').on('click', function (event) {
        const classid = event.target.id;
        var requestConfig = {
            method: 'GET',
            url: '/api/getClassPosts',
            contentType: 'application/json',
            data: { id: classid },
        };

        $.ajax(requestConfig).then(function handlePostResponse(
            responseMessage
        ) {
            const posts = $(responseMessage);
            classPosts.html(posts);
            const endorseButton = posts.find('.endorse-button');
            if (endorseButton.length !== 0) {
                endorseButton.on('click', (event) => {
                    event.preventDefault();
                    const postID = event.target.parentElement.id;
                    const endorse = event.target.id === 'endorse';
                    var endorseConfig = {
                        method: 'POST',
                        url: `/api/endorse/${postID}?endorse=${endorse}`,
                        contentType: 'application/json',
                    };
                    $.ajax(endorseConfig)
                        .done(() => {
                            event.target.id = endorse ? 'unendorse' : 'endorse';
                            event.target.innerText = endorse ? 'Un-endorse Post' : 'Endorse Post';
                        })
                        .fail(() => {
                            alert('Failed to endorse/unendorse post.');
                        });
                });
            }
            const commentForms = posts.find('.comment-form');
            commentForms.on('submit', function (commentevent) {
                commentevent.preventDefault();
                const children = commentevent.target.children;
                const comment = children.namedItem('comment-content').value;
                const parentid = children.namedItem('parent-id').value;
                const commentConfig = {
                    method: 'POST',
                    url: 'api/comment',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'comment-content': comment,
                        'parent-id': parentid,
                    }),
                };
                $.ajax(commentConfig)
                    .done(() => {
                        event.target.click();
                    })
                    .fail(() => {
                        alert('Comment failed to post');
                    });
            });
            const tagLinks = classPosts.find('#class-tags');
            tagLinks.on('click', function (tagevent) {
                tagevent.preventDefault();
                const href = tagevent.target.href;
                try {
                    const tag = href.match(/tag=.*/)[0].slice(4);
                    const tagRequestConfig = {
                        method: 'GET',
                        url: 'api/getClassPosts',
                        contentType: 'application/json',
                        data: { id: classid, tag },
                    };
                    $.ajax(tagRequestConfig).then((response) => {
                        handlePostResponse(response);
                        const clearFilter = $('<button>Clear Filter</button>');
                        clearFilter.on('click', () => event.target.click());
                        classPosts.find('#class-tags').append(clearFilter);
                    });
                } catch (e) {
                    console.warn('Malformed tag url: ', e);
                }
            });
        });
    });
})(window.jQuery);
