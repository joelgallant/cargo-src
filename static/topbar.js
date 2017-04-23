// Copyright 2017 The Rustw Project Developers.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import React from 'react';
import ReactDOM from 'react-dom';

const rustw = require('./rustw');
const utils = require('./utils');

// TODO
// search box
// rebuild button
// options button
// progress indicator
// top bar component + internalise state

function renderLink(text, id, visible, onClick) {
    let className;
    let onClickFn;
    if (visible) {
        className = "header_link";
        onClickFn = onClick;
    } else {
        className = "link_hidden";
        onClickFn = null;
    }

    return <span id={id} className={className} onClick={onClickFn}>{text}</span>;    
}

function HomeLink(props) {
    // Save the current window.
    const backup = history.state;
    const onClick = function() {
        rustw.pre_load_build();
        rustw.load_build(backup);
        history.pushState(backup, "", utils.make_url("#build"));
    };
    // TODO should change this to be home-looking, rather than back-looking
    return renderLink("← return to build results", "link_back", props.visible, onClick);
}

function BrowseLink(props) {
    const onClick = () => rustw.get_source(CONFIG.source_directory);
    return renderLink("browse source", "link_browse", props.visible, onClick);
}

function winSearch(needle) {
    $.ajax({
        url: utils.make_url('search?needle=' + needle),
        type: 'POST',
        dataType: 'JSON',
        cache: false
    })
    .done(function (json) {
        var state = {
            "page": "search",
            "data": json,
            "needle": needle,
        };
        rustw.load_search(state);
        history.pushState(state, "", utils.make_url("#search=" + needle));
    })
    .fail(function (xhr, status, errorThrown) {
        console.log("Error with search request for " + needle);
        console.log("error: " + errorThrown + "; status: " + status);

        rustw.load_error();
        history.pushState({}, "", utils.make_url("#search=" + needle));
    });

    $("#div_main").text("Loading...");
}

function SearchBox(props) {
    const onKeyPress = (e) => {
        if (e.which == 13) {
            winSearch(e.currentTarget.value);
        }
    };

    return <input id="search_box" placeholder="identifier search" autocomplete="off" onKeyPress={onKeyPress}></input>;
}

module.exports = {
    renderHomeLink: function() {
        ReactDOM.render(
            <HomeLink visible="true"/>,
            $("#link_back_container").get(0)
        );
    },

    unrenderHomeLink: function() {
            ReactDOM.render(<HomeLink />, $("#link_back_container").get(0));
    },

    renderBrowseLink: function() {
        ReactDOM.render(
            <BrowseLink visible="true"/>,
            $("#link_browse_container").get(0)
        );
    },

    unrenderBrowseLink: function() {
            ReactDOM.render(<BrowseLink />, $("#link_browse_container").get(0));
    },

    renderSearchBox: function() {
        ReactDOM.render(
            <SearchBox />,
            $("#search_box_container").get(0)
        );
    }
}