const printPoem = () => {
    const poem = [
        "The Road Not Taken<br>",
        "Robert Frost<br><br>",
        "Two roads diverged in a yellow wood, <br>And sorry I could not travel both <br>And looked down one as far as I could <br>To where it bent in the undergrowth;<br><br>",
        "Then took the other, as just as fair, <br>And having perhaps the better claim <br>Because it was grassy and wanted wear, <br>Though as for that the passing there <br>Had worn them really about the same,<br><br>",
        "And both that morning equally lay <br>In leaves no step had trodden black. <br>Oh, I kept the first for another day! <br>Yet knowing how way leads on to way <br>I doubted if I should ever come back.<br><br>",
        "I shall be telling this with a sigh <br>Somewhere ages and ages hence: <br>Two roads diverged in a wood, and I, <br>I took the one less traveled by, <br>And that has made all the difference."
    ]

    let output = "";

     for (const content of poem){
        output += `${content}`
    } 

    return output;
}


export default printPoem;