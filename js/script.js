{
  ('use strict');
  const templates = {
    articleLink: Handlebars.compile(
      document.querySelector('#template-article-link').innerHTML
    ),
    tagLink: Handlebars.compile(
      document.querySelector('#template-tag-link').innerHTML
    ),
    authorLink: Handlebars.compile(
      document.querySelector('#template-author-link').innerHTML
    ),
    tagCloudLink: Handlebars.compile(
      document.querySelector('#template-tag-cloud-link').innerHTML
    ),
    authorListLink: Handlebars.compile(
      document.querySelector('#template-author-list-link').innerHTML
    ),
  };

  const opts = {
    ArticleSelector: '.post',
    TitleSelector: '.post-title',
    TitleListSelector: '.titles',
    ArticleTagsSelector: '.post-tags .list',
    ArticleAuthorSelector: '.post-author',
    TagsListSelector: '.tags.list',
    CloudClassCount: 6,
    CloudClassPrefix: 'tag-size-',
    AuthorsListSelector: '.list.authors',
  };

  const titleClickHandler = function (event) {
    event.preventDefault();

    console.log('Link was clicked');
    console.log(event);

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* add class 'active' to the clicked link */
    const clickedElement = this;
    console.log('clickedElement:', clickedElement);

    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('article.active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const clickedArticleHref = clickedElement.getAttribute('href');
    console.log(clickedArticleHref);

    /* find the correct article using the selector (value of 'href' attribute) */
    const clickedArticle = document.querySelector(clickedArticleHref);
    console.log(clickedArticle);

    /* add class 'active' to the correct article */
    clickedArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(opts.TitleListSelector);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(
      opts.ArticleSelector + customSelector
    );
    console.log(articles);

    let html = '';

    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;

      /* create HTML of the link */
      // const linkHTML =
      //   '<li><a href="#' +
      //   articleId +
      //   '"><span>' +
      //   articleTitle +
      //   '</span></a></li>';
      // console.log(linkHTML);

      const linkHtmlData = { id: articleId, title: articleTitle };
      const linkHtml = templates.articleLink(linkHtmlData);

      /* insert link into titleList */
      html = html + linkHtml;
    }
    console.log(html);
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = { max: 0, min: 999999 };
    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }

  function calculateTagClass(count, params) {
    const classNumber = Math.floor(
      ((count - params.min) / (params.max - params.min)) *
        (opts.CloudClassCount - 1) +
        1
    );
    return opts.CloudClassPrefix + classNumber;
  }

  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(opts.ArticleSelector);
    console.log(articles);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opts.ArticleTagsSelector);
      console.log(tagsWrapper);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      console.log('articleTags: ', articleTags);

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      console.log('articleTagsArray :', articleTagsArray);

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        // const tagHtml = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        // console.log('tagHtml: ', tagHtml);

        const tagHtmlData = { tagName: tag };
        const tagHtml = templates.tagLink(tagHtmlData);

        // /* add generated code to html variable */
        html = html + tagHtml;
        console.log(html);

        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
        console.log('allTags: ', allTags);
      }

      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;

      /* END LOOP: for every article: */
      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector(opts.TagsListSelector);
      const tagsParams = calculateTagsParams(allTags);
      console.log('tagsParams: ', tagsParams);

      /* [NEW] create variable for all links HTML code */
      // let allTagsHtml = '';
      const allTagsData = { tags: [] };

      /* [NEW] START LOOP: for each tag in allTags: */
      for (let tag in allTags) {
        /* [NEW] generate code of a link and add it to allTagsHTML */

        allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateTagClass(allTags[tag], tagsParams),
        });

        // allTagsHtml +=
        //   '<li><a href="#tag-' +
        //   tag +
        //   '" class="' +
        //   calculateTagClass(allTags[tag], tagsParams) +
        //   '">' +
        //   tag +
        //   // " (" +
        //   // allTags[tag] +
        //   // ")" +
        //   '</a></li>';

        /* [NEW] END LOOP: for each tag in allTags: */
      }

      /*[NEW] add HTML from allTagsHTML to tagList */
      // tagList.innerHTML = allTagsHtml;
      // console.log('allTagsHtml: ', allTagsHtml);

      tagList.innerHTML = templates.tagCloudLink(allTagsData);
      console.log('allTagsData: ', allTagsData);
    }
  }
  generateTags();

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');

      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let tagLink of tagLinks) {
      /* add class active */
      tagLink.classList.add('active');

      /* END LOOP: for each found tag link */
    }

    // NEW Remove active class from author after click on tag
    const activeAuthorLinks = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );
    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);

      /* END LOOP: for each link */
    }
    console.log(tagLinks);
  }

  addClickListenersToTags();

  function generateAuthors() {
    let allAuthors = {};
    const articles = document.querySelectorAll(opts.ArticleSelector);
    for (let article of articles) {
      const authorWrapper = article.querySelector(opts.ArticleAuthorSelector);
      console.log(authorWrapper);
      let html = '';
      const articleAuthor = article.getAttribute('data-author');
      console.log(articleAuthor);
      // const authorHtml =
      //   '<a href="#author-' + articleAuthor + '">by ' + articleAuthor + '</a>';
      // console.log(authorHtml);
      const authorHtmlData = { author: articleAuthor };
      const authorHtml = templates.authorLink(authorHtmlData);

      html = html + authorHtml;
      authorWrapper.innerHTML = html;

      if (!allAuthors[articleAuthor]) {
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
    }
    console.log('allAuthors: ', allAuthors);
    const authorList = document.querySelector(opts.AuthorsListSelector);
    console.log('authorList: ', authorList);

    // let allAuthorsHtml = '';
    const allAuthorsData = { authors: [] };

    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });

      // allAuthorsHtml +=
      //   '<li><a href="#author-' +
      //   author +
      //   '">' +
      //   author +
      //   '(' +
      //   allAuthors[author] +
      //   ')</a></li>';
    }
    // console.log('allAuthorsHtml', allAuthorsHtml);
    // authorList.innerHTML = allAuthorsHtml;
    authorList.innerHTML = templates.authorListLink(allAuthorsData);
  }
  generateAuthors();

  function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const activeAuthorLinks = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );
    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
    for (let authorLink of authorLinks) {
      authorLink.classList.add('active');
    }
    // NEW Remove active class from tags after click on author
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    for (let activeTagLink of activeTagLinks) {
      activeTagLink.classList.remove('active');
    }

    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    for (let authorLink of authorLinks) {
      authorLink.addEventListener('click', authorClickHandler);
    }
  }
  addClickListenersToAuthors();
}
