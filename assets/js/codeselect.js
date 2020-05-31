// adapted from https://stackoverflow.com/a/48078807/1217368
$(document).ready(function() {
   $('div.highlight').each(function(i) {
      if ($(this).parent().prev().is("h6")) {

        // create an id for the current code section
        var currentId = "codeblock" + (i + 1);

        // find the code section and add the id to it
        var codeSection = $(this).find('code');
        codeSection.attr('id', currentId);

        // now create the button, setting the clipboard target to the id
        var btn = document.createElement('a');
        btn.setAttribute('type', 'btn');
        btn.setAttribute('class', 'btn-copy-code');
        btn.setAttribute('data-clipboard-target', '#' + currentId);
        btn.innerHTML = '<i class="far fa-copy fa"></i>';
        this.insertBefore(btn, this.firstChild);
      } else {
        $(this).addClass("code-block-without-title");
      }
    });

    new ClipboardJS('.btn-copy-code');
  });
