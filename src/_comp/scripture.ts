
export const translation_options = ['bsb', 'esv', 'niv', 'csb']


export const scripture_by_topic:Record<string, string[]> = {
    "Free giving": ["Matt 10:7-8", "1 Cor 9:12", "1 Cor 9:14-15", "1 Cor 9:18", "2 Cor 11:7-9", "Rev 21:6"],
    "Condemnation": ["Micah 3:11", "Luke 16:13", "2 Cor 2:17", "1 Tim 6:5b-8", "Titus 1:10-11", "1 Peter 5:1-2"],
    "Stories": ["1 Sam 2:15-17", "2 Kings 5:15-16", "John 2:14-16", "Acts 8:18-21"],
    "Provision": ["Matt 9:37-38", "Matt 10:9-10", "Phil 4:18"],
    "Forbidding others": ["Luke 9:49-50", "1 Cor 6:7"],
    "Attitude": ["Luke 17:7-10", "Acts 4:32"],
}


// NOTE These are expected to be in traditional order
export const scripture:Record<string, {bsb:string, esv:string, niv:string, csb:string}> = {

"1 Sam 2:15-17": {
    bsb: "Even before the fat was burned, the servant of the priest would come and say to the man who was sacrificing, “Give the priest some meat to roast, because he will not accept boiled meat from you, but only raw.” And if any man said to him, “The fat must be burned first; then you may take whatever you want,” the servant would reply, “No, you must give it to me right now. If you refuse, I will take it by force!” Thus the sin of these young men was severe in the sight of the LORD, for they were treating the LORD’s offering with contempt.",
    esv: "Moreover, before the fat was burned, the priest's servant would come and say to the man who was sacrificing, “Give meat for the priest to roast, for he will not accept boiled meat from you but only raw.” And if the man said to him, “Let them burn the fat first, and then take as much as you wish,” he would say, “No, you must give it now, and if not, I will take it by force.” Thus the sin of the young men was very great in the sight of the Lord, for the men treated the offering of the Lord with contempt.",
    niv: "But even before the fat was burned, the priest’s servant would come and say to the person who was sacrificing, “Give the priest some meat to roast; he won’t accept boiled meat from you, but only raw.” If the person said to him, “Let the fat be burned first, and then take whatever you want,” the servant would answer, “No, hand it over now; if you don’t, I’ll take it by force.” This sin of the young men was very great in the Lord’s sight, for they were treating the Lord’s offering with contempt.",
    csb: "Even before the fat was burned, the priest’s servant would come and say to the one who was sacrificing, “Give the priest some meat to roast, because he won’t accept boiled meat from you—only raw.” If that person said to him, “The fat must be burned first; then you can take whatever you want for yourself,” the servant would reply, “No, I insist that you hand it over right now. If you don’t, I’ll take it by force!” So the servants’ sin was very severe in the presence of the Lord, because the men treated the Lord’s offering with contempt.",
},

"2 Kings 5:15-16": {
    bsb: "Then Naaman and all his attendants went back to the man of God, stood before him, and declared, “Now I know for sure that there is no God in all the earth except in Israel. So please accept a gift from your servant.” But Elisha replied, “As surely as the LORD lives, before whom I stand, I will not accept it.” And although Naaman urged him to accept it, he refused.",
    esv: "Then he returned to the man of God, he and all his company, and he came and stood before him. And he said, “Behold, I know that there is no God in all the earth but in Israel; so accept now a present from your servant.” But he said, “As the Lord lives, before whom I stand, I will receive none.” And he urged him to take it, but he refused.",
    niv: "Then Naaman and all his attendants went back to the man of God. He stood before him and said, “Now I know that there is no God in all the world except in Israel. So please accept a gift from your servant.” The prophet answered, “As surely as the Lord lives, whom I serve, I will not accept a thing.” And even though Naaman urged him, he refused.",
    csb: "Then Naaman and his whole company went back to the man of God, stood before him, and declared, “I know there’s no God in the whole world except in Israel. Therefore, please accept a gift from your servant.” But Elisha said, “As the Lord lives, in whose presence I stand, I will not accept it.” Naaman urged him to accept it, but he refused.",
},

"Ecc 8:14a": {
    bsb: "There is a futility that is done on the earth: There are righteous men who get what the actions of the wicked deserve, and there are wicked men who get what the actions of the righteous deserve.",
    esv: "There is a vanity that takes place on earth, that there are righteous people to whom it happens according to the deeds of the wicked, and there are wicked people to whom it happens according to the deeds of the righteous.",
    niv: "There is something else meaningless that occurs on earth: the righteous who get what the wicked deserve, and the wicked who get what the righteous deserve.",
    csb: "There is a futility that is done on the earth: there are righteous people who get what the actions of the wicked deserve, and there are wicked people who get what the actions of the righteous deserve.",
},

"Micah 3:11": {
    // NOTE Newlines preserved for articles with own translation that also preserve it
    bsb: "Her leaders judge for a bribe,\nher priests teach for a price,\nand her prophets practice divination for money.\nYet they lean upon the LORD, saying,\n“Is not the LORD among us?\nNo disaster can come upon us.”",
    esv: "Its heads give judgment for a bribe;\nits priests teach for a price;\nits prophets practice divination for money;\nyet they lean on the Lord and say,\n“Is not the Lord in the midst of us?\nNo disaster shall come upon us.”",
    niv: "Her leaders judge for a bribe,\nher priests teach for a price,\nand her prophets tell fortunes for money.\nYet they look for the Lord’s support and say,\n“Is not the Lord among us?\nNo disaster will come upon us.”",
    csb: "Her leaders issue rulings for a bribe,\nher priests teach for payment,\nand her prophets practice divination for silver.\nYet they lean on the Lord, saying,\n“Isn’t the Lord among us?\nNo disaster will overtake us.”",
},

"Micah 3:11b": {
    bsb: "her priests teach for a price, and her prophets practice divination for money. Yet they lean upon the LORD, saying, “Is not the LORD among us? No disaster can come upon us.”",
    esv: "its priests teach for a price; its prophets practice divination for money; yet they lean on the Lord and say, “Is not the Lord in the midst of us? No disaster shall come upon us.”",
    niv: "her priests teach for a price, and her prophets tell fortunes for money. Yet they look for the Lord’s support and say, “Is not the Lord among us? No disaster will come upon us.”",
    csb: "her priests teach for payment, and her prophets practice divination for silver. Yet they lean on the Lord, saying, “Isn’t the Lord among us? No disaster will overtake us.”",
},

"Matt 9:37-38": {
    bsb: "Then He said to His disciples, “The harvest is plentiful, but the workers are few. Ask the Lord of the harvest, therefore, to send out workers into His harvest.”",
    esv: "Then he said to his disciples, “The harvest is plentiful, but the laborers are few; therefore pray earnestly to the Lord of the harvest to send out laborers into his harvest.”",
    niv: "Then he said to his disciples, “The harvest is plentiful but the workers are few. Ask the Lord of the harvest, therefore, to send out workers into his harvest field.”",
    csb: "Then he said to his disciples, “The harvest is abundant, but the workers are few. Therefore, pray to the Lord of the harvest to send out workers into his harvest.”",
},

"Matt 10:5-8": {
    bsb: "These twelve Jesus sent out with the following instructions: “Do not go onto the road of the Gentiles or enter any town of the Samaritans. Go rather to the lost sheep of Israel. As you go, preach this message: ‘The kingdom of heaven is near.’ Heal the sick, raise the dead, cleanse the lepers, drive out demons. Freely you have received; freely give.",
    esv: "These twelve Jesus sent out, instructing them, “Go nowhere among the Gentiles and enter no town of the Samaritans, but go rather to the lost sheep of the house of Israel. And proclaim as you go, saying, ‘The kingdom of heaven is at hand.’ Heal the sick, raise the dead, cleanse lepers, cast out demons. You received without paying; give without pay.",
    niv: "These twelve Jesus sent out with the following instructions: “Do not go among the Gentiles or enter any town of the Samaritans. Go rather to the lost sheep of Israel. As you go, proclaim this message: ‘The kingdom of heaven has come near.’ Heal the sick, raise the dead, cleanse those who have leprosy, drive out demons. Freely you have received; freely give.",
    csb: "Jesus sent out these twelve after giving them instructions: “Don’t take the road that leads to the Gentiles, and don’t enter any Samaritan town. Instead, go to the lost sheep of the house of Israel. As you go, proclaim, ‘The kingdom of heaven has come near.’ Heal the sick, raise the dead, cleanse those with leprosy, drive out demons. Freely you received, freely give.",
},

"Matt 10:7-8": {
    bsb: "As you go, preach this message: ‘The kingdom of heaven is near.’ Heal the sick, raise the dead, cleanse the lepers, drive out demons. Freely you have received; freely give.",
    esv: "“And proclaim as you go, saying, ‘The kingdom of heaven is at hand.’ Heal the sick, raise the dead, cleanse lepers, cast out demons. You received without paying; give without pay.”",
    niv: "“As you go, proclaim this message: ‘The kingdom of heaven has come near.’ Heal the sick, raise the dead, cleanse those who have leprosy, drive out demons. Freely you have received; freely give.”",
    csb: "“As you go, proclaim, ‘The kingdom of heaven has come near.’ Heal the sick, raise the dead, cleanse those with leprosy, drive out demons. Freely you received, freely give.”",
},

"Matt 10:9-10": {
    bsb: "Do not carry any gold or silver or copper in your belts. Take no bag for the road, or second tunic, or sandals, or staff; for the worker is worthy of his provisions.",
    esv: "“Acquire no gold or silver or copper for your belts, no bag for your journey, or two tunics or sandals or a staff, for the laborer deserves his food.”",
    niv: "“Do not get any gold or silver or copper to take with you in your belts— no bag for the journey or extra shirt or sandals or a staff, for the worker is worth his keep.”",
    csb: "“Don’t acquire gold, silver, or copper for your money-belts. Don’t take a traveling bag for the road, or an extra shirt, sandals, or a staff, for the worker is worthy of his food.”",
},

"Luke 9:49-50": {
    bsb: "“Master,” said John, “we saw someone driving out demons in Your name, and we tried to stop him, because he does not accompany us.” “Do not stop him,” Jesus replied, “for whoever is not against you is for you.”",
    esv: "John answered, “Master, we saw someone casting out demons in your name, and we tried to stop him, because he does not follow with us.” But Jesus said to him, “Do not stop him, for the one who is not against you is for you.”",
    niv: "“Master,” said John, “we saw someone driving out demons in your name and we tried to stop him, because he is not one of us.” “Do not stop him,” Jesus said, “for whoever is not against you is for you.”",
    csb: "John responded, “Master, we saw someone driving out demons in your name, and we tried to stop him because he does not follow us.” “Don’t stop him,” Jesus told him, “because whoever is not against you is for you.”",
},

"Luke 16:13": {
    bsb: "No servant can serve two masters. Either he will hate the one and love the other, or he will be devoted to the one and despise the other. You cannot serve both God and money.”",
    esv: "No servant can serve two masters, for either he will hate the one and love the other, or he will be devoted to the one and despise the other. You cannot serve God and money.”",
    niv: "“No one can serve two masters. Either you will hate the one and love the other, or you will be devoted to the one and despise the other. You cannot serve both God and money.”",
    csb: "No servant can serve two masters, since either he will hate one and love the other, or he will be devoted to one and despise the other. You cannot serve both God and money.”",
},

"Luke 17:7-10": {
    bsb: "Which of you whose servant comes in from plowing or shepherding in the field will say to him, ‘Come at once and sit down to eat’? Instead, won’t he tell him, ‘Prepare my meal and dress yourself to serve me while I eat and drink; and afterward you may eat and drink’? Does he thank the servant because he did what he was told? So you also, when you have done everything commanded of you, should say, ‘We are unworthy servants; we have only done our duty.’ ”",
    esv: "“Will any one of you who has a servant plowing or keeping sheep say to him when he has come in from the field, ‘Come at once and recline at table’? Will he not rather say to him, ‘Prepare supper for me, and dress properly, and serve me while I eat and drink, and afterward you will eat and drink’? Does he thank the servant because he did what was commanded? So you also, when you have done all that you were commanded, say, ‘We are unworthy servants; we have only done what was our duty.’”",
    niv: "“Suppose one of you has a servant plowing or looking after the sheep. Will he say to the servant when he comes in from the field, ‘Come along now and sit down to eat’? Won’t he rather say, ‘Prepare my supper, get yourself ready and wait on me while I eat and drink; after that you may eat and drink’? Will he thank the servant because he did what he was told to do? So you also, when you have done everything you were told to do, should say, ‘We are unworthy servants; we have only done our duty.’”",
    csb: "“Which one of you having a servant tending sheep or plowing will say to him when he comes in from the field, ‘Come at once and sit down to eat’? Instead, will he not tell him, ‘Prepare something for me to eat, get ready, and serve me while I eat and drink; later you can eat and drink’? Does he thank that servant because he did what was commanded? In the same way, when you have done all that you were commanded, you should say, ‘We are unworthy servants; we’ve only done our duty.’”",
},

"John 2:14-16": {
    bsb: "In the temple courts He found men selling cattle, sheep, and doves, and money changers seated at their tables. So He made a whip out of cords and drove all from the temple courts, both sheep and cattle. He poured out the coins of the money changers and overturned their tables. To those selling doves He said, “Get these out of here! How dare you turn My Father’s house into a marketplace!”",
    esv: "In the temple he found those who were selling oxen and sheep and pigeons, and the money-changers sitting there. And making a whip of cords, he drove them all out of the temple, with the sheep and oxen. And he poured out the coins of the money-changers and overturned their tables. And he told those who sold the pigeons, “Take these things away; do not make my Father's house a house of trade.”",
    niv: "In the temple courts he found people selling cattle, sheep and doves, and others sitting at tables exchanging money. So he made a whip out of cords, and drove all from the temple courts, both sheep and cattle; he scattered the coins of the money changers and overturned their tables. To those who sold doves he said, “Get these out of here! Stop turning my Father’s house into a market!”",
    csb: "In the temple he found people selling oxen, sheep, and doves, and he also found the money changers sitting there. After making a whip out of cords, he drove everyone out of the temple with their sheep and oxen. He also poured out the money changers’ coins and overturned the tables. He told those who were selling doves, “Get these things out of here! Stop turning my Father’s house into a marketplace!”",
},

"Acts 4:32": {
    bsb: "The multitude of believers was one in heart and soul. No one claimed that any of his possessions was his own, but they shared everything they owned.",
    esv: "Now the full number of those who believed were of one heart and soul, and no one said that any of the things that belonged to him was his own, but they had everything in common.",
    niv: "All the believers were one in heart and mind. No one claimed that any of their possessions was their own, but they shared everything they had.",
    csb: "Now the entire group of those who believed were of one heart and mind, and no one claimed that any of his possessions was his own, but instead they held everything in common.",
},

"Acts 8:18-21": {
    bsb: "When Simon saw that the Spirit was given through the laying on of the apostles’ hands, he offered them money. “Give me this power as well,” he said, “so that everyone on whom I lay my hands may receive the Holy Spirit.” But Peter replied, “May your silver perish with you, because you thought you could buy the gift of God with money! You have no part or share in our ministry, because your heart is not right before God.",
    esv: "Now when Simon saw that the Spirit was given through the laying on of the apostles' hands, he offered them money, saying, “Give me this power also, so that anyone on whom I lay my hands may receive the Holy Spirit.” But Peter said to him, “May your silver perish with you, because you thought you could obtain the gift of God with money! You have neither part nor lot in this matter, for your heart is not right before God.",
    niv: "When Simon saw that the Spirit was given at the laying on of the apostles’ hands, he offered them money and said, “Give me also this ability so that everyone on whom I lay my hands may receive the Holy Spirit.” Peter answered: “May your money perish with you, because you thought you could buy the gift of God with money! You have no part or share in this ministry, because your heart is not right before God.",
    csb: "When Simon saw that the Spirit was given through the laying on of the apostles’ hands, he offered them money, saying, “Give me this power also so that anyone I lay hands on may receive the Holy Spirit.” But Peter told him, “May your silver be destroyed with you, because you thought you could obtain the gift of God with money! You have no part or share in this matter, because your heart is not right before God.",
},

"1 Cor 6:7": {
    bsb: "The very fact that you have lawsuits among you means that you are thoroughly defeated already. Why not rather be wronged? Why not rather be cheated?",
    esv: "To have lawsuits at all with one another is already a defeat for you. Why not rather suffer wrong? Why not rather be defrauded?",
    niv: "The very fact that you have lawsuits among you means you have been completely defeated already. Why not rather be wronged? Why not rather be cheated?",
    csb: "As it is, to have legal disputes against one another is already a defeat for you. Why not rather be wronged? Why not rather be cheated?",
},

"1 Cor 8:9": {
    bsb: "Be careful, however, that your freedom does not become a stumbling block to the weak.",
    esv: "But take care that this right of yours does not somehow become a stumbling block to the weak.",
    niv: "Be careful, however, that the exercise of your rights does not become a stumbling block to the weak.",
    csb: "But be careful that this right of yours in no way becomes a stumbling block to the weak.",
},

"1 Cor 9:3-7": {
    bsb: "This is my defense to those who scrutinize me: Have we no right to food and to drink? Have we no right to take along a believing wife, as do the other apostles and the Lord’s brothers and Cephas? Or are Barnabas and I the only apostles who must work for a living? Who serves as a soldier at his own expense? Who plants a vineyard and does not eat of its fruit? Who tends a flock and does not drink of its milk?",
    esv: "This is my defense to those who would examine me. Do we not have the right to eat and drink? Do we not have the right to take along a believing wife, as do the other apostles and the brothers of the Lord and Cephas? Or is it only Barnabas and I who have no right to refrain from working for a living? Who serves as a soldier at his own expense? Who plants a vineyard without eating any of its fruit? Or who tends a flock without getting some of the milk?",
    niv: "This is my defense to those who sit in judgment on me. Don’t we have the right to food and drink? Don’t we have the right to take a believing wife along with us, as do the other apostles and the Lord’s brothers and Cephas? Or is it only I and Barnabas who lack the right to not work for a living? Who serves as a soldier at his own expense? Who plants a vineyard and does not eat its grapes? Who tends a flock and does not drink the milk?",
    csb: "My defense to those who examine me is this: Don’t we have the right to eat and drink? Don’t we have the right to be accompanied by a believing wife like the other apostles, the Lord’s brothers, and Cephas? Or do only Barnabas and I have no right to refrain from working? Who serves as a soldier at his own expense? Who plants a vineyard and does not eat its fruit? Or who shepherds a flock and does not drink the milk from the flock?",
},

"1 Cor 9:12": {
    bsb: "If others have this right to your support, shouldn’t we have it all the more? But we did not exercise this right. Instead, we put up with anything rather than hinder the gospel of Christ.",
    esv: "If others share this rightful claim on you, do not we even more? Nevertheless, we have not made use of this right, but we endure anything rather than put an obstacle in the way of the gospel of Christ.",
    niv: "If others have this right of support from you, shouldn’t we have it all the more? But we did not use this right. On the contrary, we put up with anything rather than hinder the gospel of Christ.",
    csb: "If others have this right to receive benefits from you, don’t we even more? Nevertheless, we have not made use of this right; instead, we endure everything so that we will not hinder the gospel of Christ.",
},

"1 Cor 9:13-14": {
    bsb: "Do you not know that those who work in the temple eat of its food, and those who serve at the altar partake of its offerings? In the same way, the Lord has prescribed that those who preach the gospel should receive their living from the gospel.",
    esv: "Do you not know that those who are employed in the temple service get their food from the temple, and those who serve at the altar share in the sacrificial offerings? In the same way, the Lord commanded that those who proclaim the gospel should get their living by the gospel.",
    niv: "Don’t you know that those who serve in the temple get their food from the temple, and that those who serve at the altar share in what is offered on the altar? In the same way, the Lord has commanded that those who preach the gospel should receive their living from the gospel.",
    csb: "Don’t you know that those who perform the temple services eat the food from the temple, and those who serve at the altar share in the offerings of the altar? In the same way, the Lord has commanded that those who preach the gospel should earn their living by the gospel.",
},

"1 Cor 9:14-15": {
    bsb: "In the same way, the Lord has prescribed that those who preach the gospel should receive their living from the gospel. But I have not used any of these rights. And I am not writing this to suggest that something be done for me. Indeed, I would rather die than let anyone nullify my boast.",
    esv: "In the same way, the Lord commanded that those who proclaim the gospel should get their living by the gospel. But I have made no use of any of these rights, nor am I writing these things to secure any such provision. For I would rather die than have anyone deprive me of my ground for boasting.",
    niv: "In the same way, the Lord has commanded that those who preach the gospel should receive their living from the gospel. But I have not used any of these rights. And I am not writing this in the hope that you will do such things for me, for I would rather die than allow anyone to deprive me of this boast.",
    csb: "In the same way, the Lord has commanded that those who preach the gospel should earn their living by the gospel. For my part I have used none of these rights, nor have I written these things that they may be applied in my case. For it would be better for me to die than for anyone to deprive me of my boast!",
},

"1 Cor 9:18": {
    bsb: "What then is my reward? That in preaching the gospel I may offer it free of charge, and so not use up my rights in preaching it.",
    esv: "What then is my reward? That in my preaching I may present the gospel free of charge, so as not to make full use of my right in the gospel.",
    niv: "What then is my reward? Just this: that in preaching the gospel I may offer it free of charge, and so not make full use of my rights as a preacher of the gospel.",
    csb: "What then is my reward? To preach the gospel and offer it free of charge and not make full use of my rights in the gospel.",
},

"2 Cor 2:17": {
    bsb: "For we are not like so many others, who peddle the word of God for profit. On the contrary, in Christ we speak before God with sincerity, as men sent from God.",
    esv: "For we are not, like so many, peddlers of God's word, but as men of sincerity, as commissioned by God, in the sight of God we speak in Christ.",
    niv: "Unlike so many, we do not peddle the word of God for profit. On the contrary, in Christ we speak before God with sincerity, as those sent from God.",
    csb: "For we do not market the word of God for profit like so many. On the contrary, we speak with sincerity in Christ, as from God and before God.",
},

"2 Cor 11:7-9": {
    bsb: "Was it a sin for me to humble myself in order to exalt you, because I preached the gospel of God to you free of charge? I robbed other churches by accepting their support in order to serve you. And when I was with you and in need, I was not a burden to anyone; for the brothers who came from Macedonia supplied my needs. I have refrained from being a burden to you in any way, and I will continue to do so.",
    esv: "Or did I commit a sin in humbling myself so that you might be exalted, because I preached God's gospel to you free of charge? I robbed other churches by accepting support from them in order to serve you. And when I was with you and was in need, I did not burden anyone, for the brothers who came from Macedonia supplied my need. So I refrained and will refrain from burdening you in any way.",
    niv: "Was it a sin for me to lower myself in order to elevate you by preaching the gospel of God to you free of charge? I robbed other churches by receiving support from them so as to serve you. And when I was with you and needed something, I was not a burden to anyone, for the brothers who came from Macedonia supplied what I needed. I have kept myself from being a burden to you in any way, and will continue to do so.",
    csb: "Or did I commit a sin by humbling myself so that you might be exalted, because I preached the gospel of God to you free of charge? I robbed other churches by taking pay from them to minister to you. When I was present with you and in need, I did not burden anyone, since the brothers who came from Macedonia supplied my needs. I have kept myself, and will keep myself, from burdening you in any way.",
},

"1 Tim 6:5b-8": {
    bsb: "men of depraved mind who are devoid of the truth. These men regard godliness as a means of gain. Of course, godliness with contentment is great gain. For we brought nothing into the world, so we cannot carry anything out of it. But if we have food and clothing, we will be content with these.",
    esv: "people who are depraved in mind and deprived of the truth, imagining that godliness is a means of gain. But godliness with contentment is great gain, for we brought nothing into the world, and we cannot take anything out of the world. But if we have food and clothing, with these we will be content.",
    niv: "people of corrupt mind, who have been robbed of the truth and who think that godliness is a means to financial gain. But godliness with contentment is great gain. For we brought nothing into the world, and we can take nothing out of it. But if we have food and clothing, we will be content with that.",
    csb: "people whose minds are depraved and deprived of the truth, who imagine that godliness is a way to material gain. But godliness with contentment is great gain. For we brought nothing into the world, and we can take nothing out. If we have food and clothing, we will be content with these.",
},

"Titus 1:10-11": {
    bsb: "For many are rebellious and full of empty talk and deception, especially those of the circumcision, who must be silenced. For the sake of dishonorable gain, they undermine entire households and teach things they should not.",
    esv: "For there are many who are insubordinate, empty talkers and deceivers, especially those of the circumcision party. They must be silenced, since they are upsetting whole families by teaching for shameful gain what they ought not to teach.",
    niv: "For there are many rebellious people, full of meaningless talk and deception, especially those of the circumcision group. They must be silenced, because they are disrupting whole households by teaching things they ought not to teach—and that for the sake of dishonest gain.",
    csb: "For there are many rebellious people, full of empty talk and deception, especially those from the circumcision party. It is necessary to silence them; they are ruining entire households by teaching what they shouldn’t in order to get money dishonestly.",
},

"Phil 4:18": {
    bsb: "I have all I need and more, now that I have received your gifts from Epaphroditus. They are a fragrant offering, an acceptable sacrifice, well-pleasing to God.",
    esv: "I have received full payment, and more. I am well supplied, having received from Epaphroditus the gifts you sent, a fragrant offering, a sacrifice acceptable and pleasing to God.",
    niv: "I have received full payment and have more than enough. I am amply supplied, now that I have received from Epaphroditus the gifts you sent. They are a fragrant offering, an acceptable sacrifice, pleasing to God.",
    csb: "But I have received everything in full, and I have an abundance. I am fully supplied, having received from Epaphroditus what you provided—a fragrant offering, an acceptable sacrifice, pleasing to God.",
},

"1 Peter 5:1-2": {
    bsb: "As a fellow elder, a witness of Christ’s sufferings, and a partaker of the glory to be revealed, I appeal to the elders among you: Be shepherds of God’s flock that is among you, watching over them not out of compulsion, but because it is God’s will; not out of greed, but out of eagerness;",
    esv: "So I exhort the elders among you, as a fellow elder and a witness of the sufferings of Christ, as well as a partaker in the glory that is going to be revealed: shepherd the flock of God that is among you, exercising oversight, not under compulsion, but willingly, as God would have you; not for shameful gain, but eagerly;",
    niv: "To the elders among you, I appeal as a fellow elder and a witness of Christ’s sufferings who also will share in the glory to be revealed: Be shepherds of God’s flock that is under your care, watching over them—not because you must, but because you are willing, as God wants you to be; not pursuing dishonest gain, but eager to serve;",
    csb: "I exhort the elders among you as a fellow elder and witness to the sufferings of Christ, as well as one who shares in the glory about to be revealed: Shepherd God’s flock among you, not overseeing out of compulsion but willingly, as God would have you; not out of greed for money but eagerly;",
},

"Rev 21:6": {
    bsb: "And He told me, “It is done! I am the Alpha and the Omega, the Beginning and the End. To the thirsty I will give freely from the spring of the water of life.",
    esv: "And he said to me, “It is done! I am the Alpha and the Omega, the beginning and the end. To the thirsty I will give from the spring of the water of life without payment.",
    niv: "He said to me: “It is done. I am the Alpha and the Omega, the Beginning and the End. To the thirsty I will give water without cost from the spring of the water of life.",
    csb: "Then he said to me, “It is done! I am the Alpha and the Omega, the beginning and the end. I will freely give to the thirsty from the spring of the water of life.",
},

"Rev 22:12": {
    bsb: "“Behold, I am coming soon, and My reward is with Me, to give to each one according to what he has done.",
    esv: "“Behold, I am coming soon, bringing my recompense with me, to repay each one for what he has done.”",
    niv: "“Look, I am coming soon! My reward is with me, and I will give to each person according to what they have done.”",
    csb: "“Look, I am coming soon, and my reward is with me to repay each person according to his work.”",
},

}
