
import {ref} from 'vue'


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
    beth_case: {
        name: "Bethany Case",
        title: "Cofounder of Aleph with Beth",
        education: "MA in Linguistics",
        site: 'https://freehebrew.online/',
        bio: "Bethany is a linguist, mother, artist, and Hebrew teacher with Aleph with Beth, which offers free Biblical Hebrew learning resources worldwide.",
        quote: "I've seen firsthand that many Christians around the world have little to no access to biblical language resources and in-depth Bible study tools, so we are creating public domain Hebrew resources for free translation and sharing. Copyrights and legal restrictions on Christian images, films, books, etc. often prevent me from using them to enhance the learning experience of Hebrew.",
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
    jack: {
        name: "Jack",
        title: "Missionary in remote Asia",
        education: "",
        site: '',
        bio: "Jack lives and works with a minority people group in a remote location of Asia. Sometimes he helps film parables for them in their language or encourages those that translate their scriptures. Other times he is just with them, talking goats and sheep.",
        quote: "How can we give to God more than we receive from him? If I burnt out or became poor for his sake, it would be worth it, but it still wouldn't come close to what he's given me. The least I can do is also give freely.",
    },
    craig_bradley: {
        name: "Craig Bradley",
        title: "Founder of AO Lab",
        education: "",
        site: "https://linktr.ee/helloaolab",
        bio: "Craig and AO Lab make digital tools and experiences to help Christian communities love and live out the Bible. AO Lab’s tools are designed to be easily understood and modified, and may be used freely and adapted for any purpose. AO Lab only asks you pray and seek God’s will in everything you do.",
        quote: "Our passion is making tools that Christians we have never met can modify for any purpose the Holy Spirit inspires. Only by giving things away without restriction can we ensure we are not hindering the work of God!",
    },
    robert_hunt: {
        name: "Robert Hunt",
        title: "Bible translator",
        education: "",
        site: "https://www.freely-given.org/",
        bio: "Robert served as a Bible translation trainer and facilitator for a Philippine cultural community for some thirty years. Now technically ‘retired’, he's been able to start working full-time on his long-held dream of open-licensed Bible software and datasets.",
        quote: "Way back when I switched to using Linux open-source software (generously offered freely by many people, probably mostly non-Christians), I was never able to figure out why the only encrypted and locked resources on my laptop were Bibles — even the original Hebrew and Greek texts! I founded Freely-Given.org back in 2009 to try to correct that scenario and to dedicate whatever remaining years God gives me to being at least as generous in the Bible world as others are in the secular world.",
    },
}


// A list of people ids that will be randomized client-side but NOT during SSR
export const people_ids_randomized = ref(Object.keys(people))


// A function for triggering the randomization of people_ids_randomized
// WARN Can ONLY be called in a component's onMounted hook, else will cause hydration mismatch
// NOTE Ensures only run once per site load so user doesn't get confused
let have_randomized = false
export function randomize_people(){
    if (!have_randomized){
        const random_nums = Object.fromEntries(people_ids_randomized.value.map(id => [id, Math.random()]))
        people_ids_randomized.value.sort((a, b) => random_nums[a] - random_nums[b])
        have_randomized = true
    }
}
