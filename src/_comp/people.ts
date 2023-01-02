
interface Person {
    name:string
    title:string
    education:string
    site:string
    bio:string
    quote:string
}


export const people:Record<string, Person> = {
    alan_bunning: {
        name: "Alan Bunning",
        title: "Founder of the Center for New Testament Restoration",
        education: "D.Litt.",
        site: 'https://greekcntr.org/',
        bio: "Alan is the creator of the first New Testament critical text to use purely scientific textual criticism. He received his D.Litt. degree from the Kensington Theological Academy for his work in Greek New Testament textual criticism. Alan was previously an Assistant Professor in Computer Information Systems at Ivy Tech Community College and a Senior Lecturer in Computer Science at Purdue University. He has also authored several books and is an accomplished musician.",
        quote: "I want everyone to be able to access all of the biblical resources for free that I wish I would have had access to when I first became a Christian.",
    },
    michael_johnson: {
        name: "Michael Johnson",
        title: "Director of eBible.org",
        education: "",
        site: "https://mljohnson.org/",
        bio: "Michael distributes over 1,000 freely shareable Bible translations on eBible.org. He also served as a missionary in Papua New Guinea, and has a certificate in Bible translation from the Graduate Institute of Applied Linguistics.",
        quote: "While starting to distribute the Holy Bible digitally, I ran into copyright restrictions that limited me to very old translations with archaic language. When I asked God what to do about that, the Lord directed me to do my own translation. With lots of help, the result is the copyright-free World English Bible. I started giving away Bible translation 'intellectual property' before it was popular to do so, and others found that made sense, to maximize ministry impact that way.",
    },
    conley_owens: {
        name: "Conley Owens",
        title: "Author of The Dorean Principle",
        education: "MDiv",
        site: 'https://thedoreanprinciple.org/',
        bio: "Conley is a software engineer, a pastor at Silicon Valley Reformed Baptist Church, and a father of eight kids.  He is also the author of The Dorean Principle: A Biblical Response to the Commercialization of Christianity.",
        quote: "I began exploring issues with licensing back in college, and over time I witnessed the substantial friction it created in ministry. I was convicted regarding the harm commercial practices cause the church, but for a long time, I was never sure if the Bible had much to say directly about the matter. It turns out it does!",
    },
    andrew_case: {
        name: "Andrew Case",
        title: "Cofounder of Aleph with Beth",
        education: "MDiv",
        site: 'https://hismagnificence.com/',
        bio: "Andrew is a Bible translation consultant and the cofounder of Aleph with Beth, which provides free videos for learning biblical Hebrew. He is also an author and musician.",
        quote: "I've seen up close the biblical knowledge famine in the developing world. I want my African brothers to have access to the same depth of Bible study that I have, but the status quo of copyright and monetized Christian resources keeps that from happening, and severely hinders my work in Bible translation. So I'm doing my part to encourage a reformation in this area.",
    },
    jon_here: {
        name: "Jon Here",
        title: "Founder of Gracious Tech",
        education: "MDiv",
        site: 'https://gracious.tech',
        bio: "Jon has served as a pastor, a missionary in South-East Asia, and went on to start his own company for creating apps for mission. Every app his company makes is free to use and open source.",
        quote: "The first app I made was for evangelizing using plain Scripture. It was almost done when I realised Bible translations forbid sharing plain Scripture! Copyright has been the number one barrier to my ministry ever since.",
    },
}
