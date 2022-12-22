
interface Person {
    name:string
    title:string
    education:string
    site:string
    bio:string
    quote:string
}


export const people:Record<string, Person> = {
    jon_here: {
        name: "Jon Here",
        title: "Founder of Gracious Tech",
        education: "MDiv",
        site: 'https://gracious.tech',
        bio: "Jon has served as a pastor, a missionary in South-East Asia, and went on to start his own company for creating apps for mission. Every app his company makes is free to use and open source.",
        quote: "The first app I made was for evangelizing using plain Scripture. It was almost done when I realised Bible translations forbid sharing plain Scripture! Copyright has been the number one barrier to my ministry ever since.",
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
}
