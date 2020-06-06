---
layout: post
title: "How to build a personal website"
summary: "Building static website using Jekyll, GitHub Pages, AWS Route 53 along with Bootstrap 4, Rake, Disqus"
tags: [Jekyll, Bootstrap 4, Rake, Disqus, Github, AWS, Route 53]
---

#### Introduction
In order to build a personal website that is accessible worldwide, we'll need to do 3 things:
1. Create your personal website artifacts;
2. Create your own domain name for your website;
3. Host your website in the internet and point your domain name to the host/provider; 

And to achieve the goals above, I basically picked up the tools/frameworks below:

* Jekyll: a framework to create your website;
* Amazon Route 53: where I purchased my [domain name](http://goplusgo.me);
* GitHub Pages: yes! Now GitHub supports hosting personal websites!

#### Jekyll
Jekyll is a simple, blog-aware, static site generator perfect for personal, project, or organization sites. And there're tons of themes you can find online. This blog originally started by following the steps below:

* [Creating a Jekyll Blog with Bootstrap 4 and Sass - Part 1](https://experimentingwithcode.com/creating-a-jekyll-blog-with-bootstrap-4-and-sass-part-1/)
* [Creating a Jekyll Blog with Bootstrap 4 and Sass - Part 2](https://experimentingwithcode.com/creating-a-jekyll-blog-with-bootstrap-4-and-sass-part-2/)
* [Creating a Jekyll Blog with Bootstrap 4 and Sass - Part 3](https://experimentingwithcode.com/creating-a-jekyll-blog-with-bootstrap-4-and-sass-part-3/)
* [Creating a Jekyll Blog with Bootstrap 4 and Sass - Part 4](https://experimentingwithcode.com/creating-a-jekyll-blog-with-bootstrap-4-and-sass-part-4/)
* [Creating a Jekyll Blog with Bootstrap 4 and Sass - Part 5](https://experimentingwithcode.com/creating-a-jekyll-blog-with-bootstrap-4-and-sass-part-5/)

On top of that, I did lots of modifications and refinements as well as adding additional features, and you can find the boilerplate of this blog from this Github repo: [https://github.com/goplusgo/boilerplate.blog.goplusgo.me](https://github.com/goplusgo/boilerplate.blog.goplusgo.me).

The cool thing on `Jekyll` is that you can compile and serve your website locally by running command:

```shell
jekyll serve --watch
```

to live monitor any changes you made.

#### GitHub Pages + Amazon Route 53:
Follow this [link](https://medium.com/@benwiz/how-to-deploy-github-pages-with-aws-route-53-registered-custom-domain-and-force-https-bbea801e5ea3) to deploy GitHub pages with AWS Route 53 registered custom domain and force HTTPS.

The coolest part on `Github Pages` is that whenever you push your commits, Github will automatically compile and deploy your project. Normally, it takes a minute or two to apply the changes when your refresh your website using the external link. 

> Note: as GitHub Pages only supporst limited number of Jekyll themes and the one I used for my [personal website](https://goplusgo.me) is just not the lucky ones. Therefore, we need to switch to remote-theme to make it working, see [commit](https://github.com/goplusgo/goplusgo.github.io/commit/3f5cb7aa20c67d9cec0ace0be161e334e1d821f1).

#### Comments

This blog integrates Disqus as the commenting system, see [Disqus](https://disqus.com) for more details.

#### Post Creation

This blog website uses [Rake](https://github.com/ruby/rake), to manage post creation. The template of a post is defined in `Rakefile` and the command used to create a new post is:

###### Rake post command
```shell
rake post title="Create post using rake" subtitle="I am testing rake post command"
```
