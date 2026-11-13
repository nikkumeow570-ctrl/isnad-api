/* ISNAD - app logic (vanilla JS, no build step) */
'use strict';

/* ---------------- DATA ---------------- */
const DUAS = [
  {"id": "istiftah", "title": "Dua Istiftah - Opening dua (Bukhari 744)", "cat": "daily", "arabic": "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ", "tr": "Allaahumma baa'id bainee wa baina khataayaaya kamaa baa'adta bainal-mashriqi wal-maghrib. Allaahumma naqqinee min khataayaaya kamaa yunaqqath-thawbul-abyadu minad-danas. Allaahummaghsilnee min khataayaaya bith-thalji wal-maa'i wal-barad.", "tp": "அல்லாஹும்ம பாஇத் பைனீ வபைன கதாயாய கமா பாஅத்த பைனல் மஷ்ரிகி வல்மஃக்ரிப். அல்லாஹும்ம நக்கினீ மின் கதாயாய கமா யுனக்கஸ் ஸவ்புல் அப்யளு மினத் தனஸ். அல்லாஹும்மஃக்ஸில்னீ மின் கதாயாய பிஸ்ஸல்ஜி வல்மாயி வல்பரத்.", "en": "O Allah, put distance between me and my sins as You put distance between the East and the West. O Allah, cleanse me of my sins as a white garment is cleansed of dirt. O Allah, wash my sins away with snow, water and hail.", "ta": "யா அல்லாஹ்! கிழக்குக்கும் மேற்குக்கும் இடையே நீ ஏற்படுத்திய தொலைவைப் போன்று, எனக்கும் என் தவறுகளுக்கும் இடையே தொலைவை ஏற்படுத்துவாயாக! வெண்மையான ஆடை அழுக்கிலிருந்து தூய்மைப்படுத்தப்படுவது போல் என்னை என் தவறுகளிலிருந்து தூய்மைப்படுத்துவாயாக! பனியாலும், தண்ணீராலும், ஆலங்கட்டியாலும் என் பாவங்களைக் கழுவி விடுவாயாக!", "ref": "Bukhari 744, Muslim 598 (API 1049)"},
  { id: 'fatiha', title: 'Surah Al-Fatiha', cat: 'daily',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    tr: "Bismillaahir Rahmaanir Raheem. Alhamdu lillaahi Rabbil 'aalameen. Ar-Rahmaanir Raheem. Maaliki yawmid-deen. Iyyaaka na'budu wa iyyaaka nasta'een. Ihdinas-siraatal mustaqeem. Siraatal-lazeena an'amta 'alaihim ghairil maghdoobi 'alaihim wa lad-daaalleen. Aameen.",
    en: 'In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of the worlds... Guide us to the straight path, the path of those You have favoured, not of those who earned anger, nor of those who went astray.',
    ref: 'Quran 1:1-7 - Fard in every Rakaat' },
  { id: 'tahiyyat', title: 'At-Tahiyyat', cat: 'daily',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    tr: "At-Tahiyyaatu lillaahi was-salawaatu wat-tayyibaat. As-salaamu 'alaika ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh. As-salaamu 'alainaa wa 'alaa 'ibaadillaahis-saaliheen. Ash-hadu al-laa ilaaha illallaah, wa ash-hadu anna Muhammadan 'abduhu wa rasooluh.",
    en: 'All greetings, prayers and good things belong to Allah. Peace be upon you O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous slaves of Allah. I bear witness that none has the right to be worshipped but Allah, and that Muhammad is His slave and Messenger.',
    ref: 'Bukhari 831, Muslim 402 (API 672)' },
  { id: 'durood', title: 'Durood Ibrahim', cat: 'daily',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    tr: "Allahumma salli 'alaa Muhammad wa 'alaa aali Muhammad, kamaa sallaita 'alaa Ibraaheem wa 'alaa aali Ibraaheem, innaka Hameedum Majeed. Allahumma baarik 'alaa Muhammad wa 'alaa aali Muhammad, kamaa baarakta 'alaa Ibraaheem wa 'alaa aali Ibraaheem, innaka Hameedum Majeed.",
    en: 'O Allah, send prayers upon Muhammad and the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.',
    ref: 'Bukhari 3370' },
  { id: 'salam_before', title: 'Dua Before Salam', cat: 'daily',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    tr: "Allahumma innee a'oodhu bika min 'adhaabi Jahannam, wa min 'adhaabil qabr, wa min fitnatil mahyaa wal mamaat, wa min sharri fitnatil Maseehid Dajjaal.",
    en: 'O Allah I seek refuge in You from the punishment of Hell, the punishment of the grave, the trials of life and death, and the evil of the trial of the Dajjal.',
    ref: 'Bukhari 1377, Muslim 588 (API 1030)' },
  {"id":"af1","title":"1. Istighfar + Allahumma antas-salam","cat":"after","arabic":"أَسْتَغْفِرُ اللَّهَ (٣) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ","tr":"Astaghfirullah (3 times). Allahumma Antas-Salaam wa minkas-salaam, tabaarakta yaa dhal-jalaali wal-ikraam.","tp":"அஸ்தக்ஃபிருல்லாஹ் (3 முறை). அல்லாஹும்ம அன்தஸ்ஸலாம், வமின்கஸ்ஸலாம், தபாரக்த யா தல்ஜலாலி வல்இக்ராம்.","en":"I seek Allah's forgiveness (3x). O Allah, You are Peace and from You is peace; blessed are You, O Possessor of majesty and honour.","ta":"அல்லாஹ்விடம் பாவமன்னிப்புக் கோருகிறேன் (3 முறை). அல்லாஹ்வே! நீயே ஸலாம் (குறைகளிலிருந்து நீங்கியவன்); உன்னிடமிருந்தே ஸலாம் (பாதுகாப்பு) வருகிறது. மகத்துவமும் கண்ணியமும் உடையவனே! நீ பாக்கியம் மிக்கவன்.","ref":"Muslim 591 (API 1037)"},
  {"id":"af2","title":"2. La ilaha illallah wahdahu","cat":"after","arabic":"لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ","tr":"Laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'alaa kulli shay'in qadeer. Allaahumma laa maani'a limaa a'tayta, wa laa mu'tiya limaa mana'ta, wa laa yanfa'u dhal-jaddi minkal-jadd.","tp":"லா இலாஹ இல்லல்லாஹு வஹ்தஹு லா ஷரீக லஹு, லஹுல்முல்கு வலஹுல்ஹம்து வஹுவ அலா குல்லி ஷைஇன் கதீர். அல்லாஹும்ம லா மானிஅ லிமா அஃதைத்த, வலா முஃதிய லிமா மனஃத்த, வலா யன்ஃபஉ தல்ஜத்தி மின்கல்ஜத்து.","en":"There is no god but Allah alone, no partner has He; His is the dominion and His is the praise, and He is able to do all things. O Allah, none can withhold what You give, none can give what You withhold, and the might of the mighty cannot benefit him against You.","ta":"அல்லாஹ்வைத் தவிர வணக்கத்திற்குரியவன் யாருமில்லை; அவன் தனித்தவன், அவனுக்கு இணை இல்லை. ஆட்சியும் புகழும் அவனுக்கே; அவன் அனைத்தின் மீதும் ஆற்றலுடையவன். அல்லாஹ்வே! நீ கொடுத்ததைத் தடுப்பவன் இல்லை; நீ தடுத்ததைக் கொடுப்பவனும் இல்லை; செல்வமும் அந்தஸ்தும் உடையவனுக்கு உன்னிடம் அவனுடைய செல்வம் பயனளிக்காது.","ref":"Bukhari 844, Muslim 593 (API 1039)"},
  {"id":"af3","title":"3. La hawla wa la quwwata illa billah","cat":"after","arabic":"لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ","tr":"Laa hawla wa laa quwwata illaa billaah. Laa ilaaha illallaah, wa laa na'budu illaa iyyaah, lahun-ni'matu wa lahul-fadlu wa lahuth-thanaa'ul-hasan. Laa ilaaha illallaahu mukhliseena lahud-deena wa law karihal-kaafiroon.","tp":"லா ஹவ்ல வலா குவ்வத இல்லா பில்லாஹ். லா இலாஹ இல்லல்லாஹ், வலா நஃபுது இல்லா இய்யாஹ், லஹுன்னிஃமத்து வலஹுல்ஃபள்லு வலஹுஸ்ஸனாஉல்ஹஸன். லா இலாஹ இல்லல்லாஹு முக்லிஸீன லஹுத்தீன வலவ் கரிஹல்காஃபிரூன்.","en":"There is no power and no strength except with Allah. There is no god but Allah and we worship none but Him. His are the favour, the grace and the best praise. There is no god but Allah; we are sincere to Him in religion even if the disbelievers dislike it.","ta":"அல்லாஹ்வின் உதவியின்றி எந்த ஆற்றலும் வலிமையும் இல்லை. அல்லாஹ்வைத் தவிர வணக்கத்திற்குரியவன் இல்லை; அவனையன்றி வேறு யாரையும் நாம் வணங்கமாட்டோம். அருளும் சிறப்பும் அழகிய புகழும் அவனுக்கே. நிராகரிப்பவர்கள் வெறுத்தாலும் மார்க்கத்தை அவனுக்கே உளப்பூர்வமாக அர்ப்பணிப்போராய் இருக்கிறோம்.","ref":"Muslim 594 (API 1041)"},
  {"id":"af4","title":"4. Tasbih 33 + 33 + 33 (+1)","cat":"after","arabic":"سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٣)، ثُمَّ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ","tr":"Subhaanallaah (33), Alhamdu lillaah (33), Allaahu akbar (33). To complete 100: Laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'alaa kulli shay'in qadeer.","tp":"சுப்ஹானல்லாஹ் (33), அல்ஹம்துலில்லாஹ் (33), அல்லாஹு அக்பர் (33). நூறு முழுமையாக: லா இலாஹ இல்லல்லாஹு வஹ்தஹு லா ஷரீக லஹு, லஹுல்முல்கு வலஹுல்ஹம்து வஹுவ அலா குல்லி ஷைஇன் கதீர்.","en":"Glory be to Allah (33), praise be to Allah (33), Allah is the Greatest (33), then complete the hundred with the tahleel. Whoever says this after every prayer, his sins are forgiven even if they are like the foam of the sea. Count on the fingers of the right hand.","ta":"அல்லாஹ் தூயவன் (33), புகழனைத்தும் அல்லாஹ்வுக்கே (33), அல்லாஹ் மிகப் பெரியவன் (33); நூறாக நிறைவு செய்ய \"லா இலாஹ இல்லல்லாஹு…\" கூறவேண்டும். இதை ஒவ்வொரு தொழுகைக்குப் பின்னும் கூறுபவரின் பாவங்கள் கடல் நுரையளவு இருந்தாலும் மன்னிக்கப்படும். வலது கையின் விரல்களால் எண்ணவேண்டும்.","ref":"Muslim 597 (API 1046)"},
  {"id":"af5","title":"5. Ayat al-Kursi (Quran 2:255)","cat":"after","arabic":"ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ","tr":"Allaahu laa ilaaha illaa huwal-hayyul-qayyoom, laa ta'khudhuhu sinatun wa laa nawm, lahu maa fis-samaawaati wa maa fil-ard...","tp":"அல்லாஹு லா இலாஹ இல்லா ஹுவல் ஹய்யுல் கய்யூம், லா தஃகுதுஹு சினதுன் வலா நவ்ம், லஹு மா ஃபிஸ்ஸமாவாதி வமா ஃபில்அர்ள்… (முழு வசனத்தையும் அரபியில் ஓதவும்)","en":"Quran 2:255. Whoever recites it after each obligatory prayer, nothing stands between him and Paradise except death.","ta":"அல்லாஹ் (எவ்வித மகத்துவமுடையவனென்றால்) அவனைத் தவிர வணக்கத்திற்குத் தகுதியான இறைவன் வேறுயாரும் இல்லவே இல்லை. அவன் (மரணமில்லா) உயிருள்ளவன்; என்றும் நிலையானவன்; அவனை சிறு உறக்கமும் பீடிக்காது; பெரும் நித்திரையும் பீடிக்காது. வானங்கள், பூமியில் உள்ளவை அனைத்தும் அவனுடையதே. அவனுடைய அனுமதியின்றி அவனிடத்தில் (எவருக்காகிலும்) யார்தான் பரிந்து பேசக்கூடும்? அவர்களுக்கு முன் இருப்பவற்றையும் அவர்களுக்குப் பின் இருப்பவற்றையும் அவன் நன்கறிவான். அவனுடைய விருப்பமின்றி அவனுக்குத் தெரிந்தவற்றிலிருந்து எதையும் (மற்றெவரும் தங்கள் அறிவால்) அறிந்துகொள்ள முடியாது. அவனுடைய ‘‘குர்ஸி' வானங்கள், பூமியைவிட விசாலமாய் இருக்கிறது. அவ்விரண்டையும் பாதுகாப்பது அவனுக்குச் சிரமம் இல்லை. மேலும், அவன்தான் மிக உயர்ந்தவன்; மிக மகத்தானவன்.","ref":"Quran 2:255","go":[2]},
  { id: 'morning', title: 'Morning & Evening Azkar', cat: 'azkar',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    tr: "Asbahnaa wa asbahal mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa shareeka lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli shay'in qadeer. (Evening: Amsaynaa wa amsal mulku lillaah...)",
    en: 'We have entered the morning and all dominion belongs to Allah... (in the evening say: We have entered the evening and all dominion belongs to Allah...).',
    ref: 'Muslim 2723 (API 5268)' },
  { id: 'wudu_dua', title: 'Dua After Wudu', cat: 'daily',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    tr: "Ash-hadu al-laa ilaaha illallaahu wahdahu laa shareeka lah, wa ash-hadu anna Muhammadan 'abduhu wa rasooluh.",
    en: 'I bear witness that none has the right to be worshipped but Allah alone, with no partner, and I bear witness that Muhammad is His slave and Messenger. (The 8 doors of Jannah are opened for the one who says it.)',
    ref: 'Muslim 234 (API 397)' },
  { id: 'after_adhan', title: 'Dua After Adhan', cat: 'azkar',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    tr: "Allahumma Rabba haadhihid-da'watit-taammah, was-salaatil qaa'imah, aati Muhammadanil waseelata wal fadeelah, wab'ath-hu maqaamam mahmoodanil-ladhee wa'adtah.",
    en: 'O Allah, Lord of this perfect call and the established prayer, grant Muhammad the Waseelah and the Fadeelah, and raise him to the praised station You promised him. (Say it after the Adhan, after repeating the words of the Muadhdhin and sending Salawat on the Prophet ﷺ.)',
    ta: 'இறைவா! இந்த முழுமையான அழைப்புக்கும், நிலைநிறுத்தப்படும் தொழுகைக்கும் அதிபதியே! முஹம்மது (ஸல்) அவர்களுக்கு "வஸீலா"வையும் "ஃபளீலா"வையும் வழங்குவாயாக! நீ வாக்களித்த புகழ்பெற்ற இடத்தில் அவர்களை எழுப்புவாயாக!',
    ref: 'Bukhari 614' },
  { id: 'istikhara', title: 'Dua Istikhara', cat: 'daily',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ',
    tr: "Allahumma innee astakheeruka bi 'ilmika, wa astaqdiruka bi qudratika, wa as'aluka min fadlikal 'adheem, fa innaka taqdiru wa laa aqdir, wa ta'lamu wa laa a'lam, wa anta 'allaamul ghuyoob. Allahumma in kunta ta'lamu anna haadhal amra khairun lee fee deenee wa ma'aashee wa 'aaqibati amree faqdurhu lee wa yassirhu lee thumma baarik lee feeh. Wa in kunta ta'lamu anna haadhal amra sharrun lee fee deenee wa ma'aashee wa 'aaqibati amree fasrifhu 'annee wasrifnee 'anhu waqdur liyal khaira haythu kaana thumma ardinee bih.",
    en: 'O Allah, I seek Your guidance by Your knowledge and Your power, and ask of Your great bounty. You are able and I am not; You know and I do not; You are the Knower of the unseen. If this matter is good for my religion, livelihood and the end of my affair, decree it for me, ease it, and bless it for me. If it is bad for me, turn it away from me and me from it, and decree the good for me wherever it is, then make me content with it.',
    ref: 'Bukhari 1162, 6382 (Istikhara prayer, 2 Rakaat then this dua)' }
];
/* Tamil-script pronunciation (tp) and Tamil meaning (ta) for the older duas. */
const DUA_X = {"sana": {"tp": "சுப்ஹானகல்லாஹும்ம வபிஹம்திக, வதபாரகஸ்முக, வதஆலா ஜத்துக, வலா இலாஹ கைருக.", "ta": "இறைவா! உன்னைப் போற்றிப் புகழ்ந்து உன் தூய்மையைத் துதிக்கிறேன். உன் திருப்பெயர் பாக்கியம் மிக்கது; உன் மகத்துவம் மேலானது; உன்னைத் தவிர வணக்கத்திற்குரிய இறைவன் வேறு யாருமில்லை."}, "fatiha": {"tp": "பிஸ்மில்லாஹிர் ரஹ்மானிர் ரஹீம். அல்ஹம்து லில்லாஹி ரப்பில் ஆலமீன். அர்ரஹ்மானிர் ரஹீம். மாலிகி யவ்மித்தீன். இய்யாக்க நஃபுது வஇய்யாக்க நஸ்தஈன். இஹ்தினஸ் ஸிராதல் முஸ்தகீம். ஸிராதல்லதீன அன்அம்த அலைஹிம், கைரில் மஃக்ளூபி அலைஹிம் வலழ்ழால்லீன். ஆமீன்.", "ta": "அளவிலா அருளாளன், நிகரிலா அன்பாளன் அல்லாஹ்வின் பெயரால் அகிலங்களின் இறைவனாகிய அல்லாஹ்வுக்கே எல்லாப் புகழும் (அவன்) அளவிலா அருளாளன்; நிகரிலா அன்பாளன் தீர்ப்பு நாளின் அரசன் உன்னையே நாங்கள் வணங்குகிறோம். உன்னிடமே உதவி தேடுகிறோம். எங்களை நேரான வழியில் நடத்துவாயாக! (அது) நீ யாருக்கு அருள் புரிந்தாயோ அவர்களின் வழி! அவர்கள் (உன்னால்) கோபிக்கப்பட்டவர்கள் அல்ல; வழி தவறியவர்களும் அல்ல!"}, "tahiyyat": {"tp": "அத்தஹிய்யாது லில்லாஹி வஸ்ஸலவாது வத்தய்யிபாது, அஸ்ஸலாமு அலைக்க அய்யுஹந் நபிய்யு வரஹ்மத்துல்லாஹி வபரக்காதுஹு, அஸ்ஸலாமு அலைனா வஅலா இபாதில்லாஹிஸ் ஸாலிஹீன், அஷ்ஹது அல்லா இலாஹ இல்லல்லாஹு வஅஷ்ஹது அன்ன முஹம்மதன் அப்துஹு வரஸூலுஹ்.", "ta": "எல்லா காணிக்கைகளும், வணக்கங்களும், நன்மைகளும் அல்லாஹ்வுக்கே உரியன. நபியே! உங்கள் மீது சாந்தியும், அல்லாஹ்வின் அருளும் பரக்கத்தும் உண்டாவதாக! எங்கள் மீதும் அல்லாஹ்வின் நல்லடியார்கள் மீதும் சாந்தி உண்டாவதாக! வணக்கத்திற்குரியவன் அல்லாஹ்வைத் தவிர வேறு யாருமில்லை என்றும், முஹம்மது ﷺ அவனுடைய அடியாரும் தூதருமாவார்கள் என்றும் சாட்சி கூறுகிறேன்."}, "durood": {"tp": "அல்லாஹும்ம ஸல்லி அலா முஹம்மதின் வஅலா ஆலி முஹம்மத், கமா ஸல்லைத்த அலா இப்ராஹீம வஅலா ஆலி இப்ராஹீம், இன்னக்க ஹமீதும் மஜீத். அல்லாஹும்ம பாரிக் அலா முஹம்மதின் வஅலா ஆலி முஹம்மத், கமா பாரக்த அலா இப்ராஹீம வஅலா ஆலி இப்ராஹீம், இன்னக்க ஹமீதும் மஜீத்.", "ta": "யா அல்லாஹ்! இப்ராஹீம் (அலை) மீதும் அவர்கள் குடும்பத்தார் மீதும் நீ அருள் புரிந்ததைப் போல் முஹம்மது ﷺ மீதும் அவர்கள் குடும்பத்தார் மீதும் அருள் புரிவாயாக! நிச்சயமாக நீ புகழுக்குரியவனும் கண்ணியமிக்கவனுமாய் இருக்கிறாய். யா அல்லாஹ்! இப்ராஹீம் (அலை) மீதும் அவர்கள் குடும்பத்தார் மீதும் நீ பரக்கத் செய்ததைப் போல் முஹம்மது ﷺ மீதும் அவர்கள் குடும்பத்தார் மீதும் பரக்கத் செய்வாயாக!"}, "rabbigh": {"tp": "ரப்பிக்ஃபிர் லீ, ரப்பிக்ஃபிர் லீ.", "ta": "என் இறைவா! என்னை மன்னிப்பாயாக! என் இறைவா! என்னை மன்னிப்பாயாக!"}, "salam_before": {"tp": "அல்லாஹும்ம இன்னீ அஊது பிக மின் அதாபி ஜஹன்னம், வமின் அதாபில் கப்ரி, வமின் ஃபித்னதில் மஹ்யா வல்மமாத், வமின் ஷர்ரி ஃபித்னதில் மஸீஹித் தஜ்ஜால்.", "ta": "யா அல்லாஹ்! நரக வேதனையிலிருந்தும், கப்ரின் வேதனையிலிருந்தும், வாழ்வு மற்றும் மரணத்தின் சோதனைகளிலிருந்தும், மஸீஹுத் தஜ்ஜாலின் சோதனையின் தீங்கிலிருந்தும் உன்னிடம் பாதுகாப்புத் தேடுகிறேன்."}, "qunoot": {"tp": "அல்லாஹும்மஹ்தினீ ஃபீமன் ஹதைத்த, வஆஃபினீ ஃபீமன் ஆஃபைத்த, வதவல்லனீ ஃபீமன் தவல்லைத்த, வபாரிக் லீ ஃபீமா அஃதைத்த, வகினீ ஷர்ர மா களைத்த, ஃபஇன்னக்க தக்ளீ வலா யுக்ளா அலைக்க, வஇன்னஹு லா யதில்லு மன் வாலைத்த, தபாரக்த ரப்பனா வதஆலைத்த.", "ta": "யா அல்லாஹ்! நீ நேர்வழி காட்டியவர்களுடன் எனக்கும் நேர்வழி காட்டுவாயாக! நீ ஆரோக்கியம் அளித்தவர்களுடன் எனக்கும் நலம் அருள்வாயாக! நீ பொறுப்பேற்றுக் கொண்டவர்களுடன் எனக்கும் பொறுப்பாளனாக இருப்பாயாக! நீ எனக்கு வழங்கியவற்றில் பரக்கத் செய்வாயாக! நீ விதித்த தீங்கை விட்டும் என்னைக் காப்பாற்றுவாயாக! நிச்சயமாக நீயே தீர்ப்பளிப்பவன்; உன் மீது யாரும் தீர்ப்பளிக்க முடியாது. நீ நேசித்தவர் இழிவடைவதில்லை. எங்கள் இறைவா! நீ பாக்கியமிக்கவன்; மிக உயர்ந்தவன்!"}, "wudu_dua": {"tp": "அஷ்ஹது அல்லா இலாஹ இல்லல்லாஹு வஹ்தஹு லா ஷரீக லஹு, வஅஷ்ஹது அன்ன முஹம்மதன் அப்துஹு வரஸூலுஹ்.", "ta": "வணக்கத்திற்குரியவன் அல்லாஹ்வைத் தவிர வேறு யாருமில்லை; அவன் தனித்தவன், அவனுக்கு இணை இல்லை என்றும், முஹம்மது ﷺ அவனுடைய அடியாரும் தூதருமாவார்கள் என்றும் சாட்சி பகர்கிறேன்."}, "after_adhan": {"tp": "அல்லாஹும்ம ரப்ப ஹாதிஹித் தஃவதித் தாம்மா, வஸ்ஸலாதில் காஇமா, ஆத்தி முஹம்மதனில் வஸீலத்த வல்ஃபளீலா, வப்அஸ்ஹு மகாமம் மஹ்மூதனில்லதீ வஅத்தஹ்."}, "morning": {"tp": "அஸ்பஹ்னா வஅஸ்பஹல் முல்கு லில்லாஹ், வல்ஹம்து லில்லாஹ், லா இலாஹ இல்லல்லாஹு வஹ்தஹு லா ஷரீக லஹு, லஹுல் முல்கு வலஹுல் ஹம்து வஹுவ அலா குல்லி ஷைஇன் கதீர்.", "ta": "நாங்கள் காலையை அடைந்தோம்; ஆட்சியதிகாரம் முழுவதும் அல்லாஹ்வுக்கே உரியது; புகழனைத்தும் அல்லாஹ்வுக்கே. அல்லாஹ்வைத் தவிர வணக்கத்திற்குரியவன் யாருமில்லை; அவன் தனித்தவன், அவனுக்கு இணை இல்லை. ஆட்சியும் புகழும் அவனுக்கே; அவன் அனைத்தின் மீதும் ஆற்றலுடையவன். (மாலையில்: \"அம்ஸைனா வஅம்ஸல் முல்கு லில்லாஹ்…\" என்று கூறவேண்டும்.)"}, "istikhara": {"tp": "அல்லாஹும்ம இன்னீ அஸ்தகீருக்க பிஇல்மிக்க, வஅஸ்தக்திருக்க பிகுத்ரத்திக்க, வஅஸ்அலுக்க மின் ஃபள்லிக்கல் அழீம். ஃபஇன்னக்க தக்திரு வலா அக்திரு, வதஃலமு வலா அஃலமு, வஅன்த அல்லாமுல் குயூப். அல்லாஹும்ம இன் குன்த தஃலமு அன்ன ஹாதல் அம்ர கைருன் லீ ஃபீ தீனீ வமஆஷீ வஆகிபதி அம்ரீ ஃபக்துர்ஹு லீ வயஸ்ஸிர்ஹு லீ ஸும்ம பாரிக் லீ ஃபீஹ். வஇன் குன்த தஃலமு அன்ன ஹாதல் அம்ர ஷர்ருன் லீ ஃபீ தீனீ வமஆஷீ வஆகிபதி அம்ரீ ஃபஸ்ரிஃப்ஹு அன்னீ வஸ்ரிஃப்னீ அன்ஹு, வக்துர் லியல் கைர ஹைஸு கான ஸும்ம அர்ளினீ பிஹ்.", "ta": "யா அல்லாஹ்! உனது ஞானத்தைக் கொண்டு உன்னிடம் நன்மையைக் கோருகிறேன்; உனது ஆற்றலைக் கொண்டு சக்தி தேடுகிறேன்; உனது மகத்தான அருளிலிருந்து கேட்கிறேன். நீ ஆற்றலுடையவன்; நான் ஆற்றல் அற்றவன். நீ அறிவாய்; நான் அறியமாட்டேன். மறைவானவற்றை நன்கறிந்தவன் நீயே. இந்தக் காரியம் என் மார்க்கத்திற்கும், என் வாழ்க்கைக்கும், என் காரியத்தின் முடிவுக்கும் நன்மையானது என நீ அறிந்தால் இதை எனக்கு விதித்து, எளிதாக்கி, பிறகு அதில் எனக்கு பரக்கத் செய்வாயாக! இது எனக்குத் தீமையானது என நீ அறிந்தால் இதை என்னை விட்டும் திருப்பி, என்னையும் இதை விட்டும் திருப்பி விடுவாயாக! நன்மை எங்கிருந்தாலும் அதை எனக்கு விதித்து, பிறகு அதைக் கொண்டு என்னைத் திருப்திப்படுத்துவாயாக!"}};
/* Strict mode: only duas whose source is Bukhari, Muslim or the Quran (all in our API). */
const NON_API = new Set(['sana', 'rabbigh', 'qunoot', 'af6', 'af7', 'af8', 'af9']);
for (let i = DUAS.length - 1; i >= 0; i--) if (NON_API.has(DUAS[i].id)) DUAS.splice(i, 1);
DUAS.forEach((d) => { const x = DUA_X[d.id]; if (x) { if (!d.tp && x.tp) d.tp = x.tp; if (!d.ta && x.ta) d.ta = x.ta; } });

const PRAYERS = [
  { key: 'Fajr', name: 'ஃபஜ்ர்', time: 'விடியல் முதல் சூரிய உதயம் வரை', fard: 2, total: '2+2' },
  { key: 'Dhuhr', name: 'ளுஹ்ர்', time: 'சூரியன் உச்சி சாய்ந்தது முதல் அஸ்ர் வரை', fard: 4, total: '4+4+2' },
  { key: 'Asr', name: 'அஸ்ர்', time: 'சூரியன் மஞ்சளாகும் முன் வரை', fard: 4, total: '4' },
  { key: 'Maghrib', name: 'மக்ரிப்', time: 'சூரிய மறைவு முதல் செவ்வானம் மறையும் வரை', fard: 3, total: '3+2' },
  { key: 'Isha', name: 'இஷா', time: 'நள்ளிரவு (இரவின் பாதி) வரை', fard: 4, total: '4+2+Witr' }
];
const TIME_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const KEY_LABEL = { Fajr: 'ஃபஜ்ர்', Sunrise: 'சூரிய உதயம்', Dhuhr: 'ளுஹ்ர்', Asr: 'அஸ்ர்', Maghrib: 'மக்ரிப்', Isha: 'இஷா' };

const NAMES_TA = { Fajr: 'ஃபஜ்ர்', Sunrise: 'சூரிய உதயம்', Dhuhr: 'ளுஹ்ர்', Asr: 'அஸ்ர்', Maghrib: 'மக்ரிப்', Isha: 'இஷா' };
const NAMES_EN = { Fajr: 'Fajr', Sunrise: 'Sunrise', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' };
function setNames() { Object.assign(KEY_LABEL, S.lang === 'en' ? NAMES_EN : NAMES_TA); PRAYERS.forEach((p) => { p.name = KEY_LABEL[p.key]; }); }
const tx = (en, ta) => (S.lang === 'en' ? en : ta);
const L = (str) => (S.lang === 'en' && typeof str === 'string' ? i18nStr(str) : str);
function remindBody(k, at) {
  return S.lead > 0 ? tx(`${KEY_LABEL[k]} in ${S.lead} min (${fmt(at)})`, `${KEY_LABEL[k]} ${S.lead} நிமிடத்தில் (${fmt(at)})`) : tx(`Time for ${KEY_LABEL[k]} (${fmt(at)})`, `${KEY_LABEL[k]} நேரம் (${fmt(at)})`);
}
const remindTitle = (k) => (k === 'Sunrise' ? KEY_LABEL.Sunrise : KEY_LABEL[k] + tx(' prayer', ' தொழுகை'));
/* Tamil <-> English: the screens are written in Tamil; English is applied to the page text from i18n.js. */
function applyLang() {
  const en = S.lang === 'en';
  try { document.documentElement.lang = en ? 'en' : 'ta'; } catch (e) {}
  setNames();
  if (!en && !applyLang.on) return;
  applyLang.on = en;
  if (typeof NodeFilter === 'undefined' || !document.createTreeWalker || !document.body) return;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const list = []; let n; while ((n = w.nextNode())) list.push(n);
  for (const nd of list) {
    if (!en) { if (nd.__ta !== undefined) { nd.nodeValue = nd.__ta; delete nd.__ta; } continue; }
    if (!I18N_TA.test(nd.nodeValue)) continue;
    const p = nd.parentElement, inTa = p && p.closest && p.closest('[lang="ta"]');
    const t = nd.nodeValue.trim();
    const out = inTa ? (I18N_EXACT[t] !== undefined ? nd.nodeValue.replace(t, I18N_EXACT[t]) : nd.nodeValue) : i18nStr(nd.nodeValue);
    if (out !== nd.nodeValue) { if (nd.__ta === undefined) nd.__ta = nd.nodeValue; nd.nodeValue = out; }
  }
  document.querySelectorAll('[placeholder],[aria-label]').forEach((el) => {
    ['placeholder', 'aria-label'].forEach((a) => {
      const k = 'ta' + a.replace('-', '');
      if (!en) { if (el.dataset[k] !== undefined) { el.setAttribute(a, el.dataset[k]); delete el.dataset[k]; } return; }
      const v = el.getAttribute(a); if (v && I18N_TA.test(v)) { const o = i18nStr(v); if (o !== v) { if (el.dataset[k] === undefined) el.dataset[k] = v; el.setAttribute(a, o); } }
    });
  });
  const lb = document.getElementById('langBtn'); if (lb) lb.textContent = en ? 'த' : 'EN';
}

const CITIES = {
  Coimbatore: [11.0168, 76.9558], Chennai: [13.0827, 80.2707], Madurai: [9.9252, 78.1198],
  Tiruchirappalli: [10.7905, 78.7047], Salem: [11.6643, 78.146], Tirunelveli: [8.7139, 77.7567],
  Erode: [11.341, 77.7172], Tiruppur: [11.1085, 77.3411], Vellore: [12.9165, 79.1325],
  Thanjavur: [10.787, 79.1378], Colombo: [6.9271, 79.8612], Singapore: [1.3521, 103.8198],
  'Kuala Lumpur': [3.139, 101.6869], Dubai: [25.2048, 55.2708], Doha: [25.2854, 51.531], Riyadh: [24.7136, 46.6753]
};

/* Worldwide offline city list (cities.js): [name, country, lat, lng, aliases]. Falls back to the small list above. */
const CITYDB = (window.WCITIES && window.WCITIES.length) ? window.WCITIES : Object.keys(CITIES).map((n) => [n, '', CITIES[n][0], CITIES[n][1], '']);
function cityMatches(q) {
  q = (q || '').trim().toLowerCase(); if (q.length < 2) return [];
  const out = [];
  CITYDB.forEach((c, i) => {
    const name = c[0].toLowerCase(), hay = (c[0] + ' ' + c[1] + ' ' + (c[4] || '')).toLowerCase();
    if (hay.indexOf(q) < 0) return;
    out.push([name.indexOf(q) === 0 ? 0 : (c[4] || '').toLowerCase().split(' ').some((w) => w.indexOf(q) === 0) ? 1 : 2, i]);
  });
  return out.sort((a, b) => a[0] - b[0] || a[1] - b[1]).slice(0, 25).map((x) => x[1]);
}
function cityRows(q) {
  const ix = cityMatches(q);
  if (!q || q.trim().length < 2) return `<p class="mute">${tx('Type at least 2 letters: a city, a country (UAE, Sri Lanka...) or a Tamil name.', 'குறைந்தது 2 எழுத்துகள்: ஊர், நாடு (UAE, Sri Lanka...) அல்லது தமிழ்ப் பெயர்.')}</p>`;
  if (!ix.length) return `<p class="mute">${tx('Not found. Use GPS, or enter coordinates below.', 'கிடைக்கவில்லை. GPS பயன்படுத்தவும் அல்லது கீழே ஆயத்தொலைவுகளை உள்ளிடவும்.')}</p>`;
  return ix.map((i) => `<button class="lrow" data-act="pickcity" data-i="${i}"><span class="li">📍</span><span class="lt"><b>${CITYDB[i][0]}</b><small>${CITYDB[i][1]}</small></span><span class="lc">›</span></button>`).join('');
}
function locCards() {
  return `<div class="card"><h3>📍 ${tx('Use my location (best)', 'என் இருப்பிடம் (சிறந்தது)')}</h3>
    <p class="mute">${tx('Works anywhere in the world, with no internet needed. Your location stays on this phone.', 'உலகில் எங்கிருந்தும் வேலை செய்யும்; இணையம் தேவையில்லை. இருப்பிடம் உங்கள் போனிலேயே இருக்கும்.')}</p>
    <div class="row"><button class="pri" data-act="gps">📍 ${tx('Use my location (GPS)', 'என் இருப்பிடத்தைப் பயன்படுத்து (GPS)')}</button></div></div>
  <div class="card"><h3>🔎 ${tx('Or search a city or country', 'அல்லது ஊர் / நாட்டைத் தேடுங்கள்')}</h3>
    <label class="field"><input type="search" id="citySearch" autocomplete="off" placeholder="${tx('Dubai, Colombo, London, கோவை...', 'Dubai, Colombo, London, கோவை...')}"></label>
    <div class="list" id="cityRes">${cityRows('')}</div></div>
  <div class="card"><details class="ad"><summary>🧭 ${tx('Enter coordinates yourself', 'ஆயத்தொலைவுகளை நீங்களே உள்ளிடுக')}</summary>
    <label class="field">${tx('Name (optional)', 'பெயர் (விருப்பம்)')}<input type="text" id="cName"></label>
    <label class="field">${tx('Latitude (e.g. 25.2048)', 'அட்சரேகை (எ.கா. 25.2048)')}<input type="text" inputmode="decimal" id="cLat"></label>
    <label class="field">${tx('Longitude (e.g. 55.2708)', 'தீர்க்கரேகை (எ.கா. 55.2708)')}<input type="text" inputmode="decimal" id="cLng"></label>
    <div class="row"><button class="sec" data-act="setcoords">${tx('Save', 'சேமி')}</button></div></details>
    <p class="mute">${tx('Times use your phone\'s time zone and automatic clock.', 'நேரங்கள் உங்கள் போனின் நேர மண்டலத்தைப் பயன்படுத்தும்.')}</p></div>`;
}

const ADHAN_LINES = [
  { ar: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', tr: 'Allahu Akbar, Allahu Akbar', ta: 'அல்லாஹ் மிகப் பெரியவன்', n: '2 முறை (மொத்தம் 4)' },
  { ar: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ', tr: 'Ash-hadu al-laa ilaaha illallaah', ta: 'அல்லாஹ்வைத் தவிர வணக்கத்திற்குரியவன் வேறு யாருமில்லை என்று சாட்சி கூறுகிறேன்', n: '2 முறை' },
  { ar: 'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ', tr: 'Ash-hadu anna Muhammadan Rasoolullaah', ta: 'முஹம்மது (ஸல்) அவர்கள் அல்லாஹ்வின் தூதர் என்று சாட்சி கூறுகிறேன்', n: '2 முறை' },
  { ar: 'حَيَّ عَلَى الصَّلَاةِ', tr: "Hayya 'alas-salaah", ta: 'தொழுகைக்கு வாருங்கள்', n: '2 முறை' },
  { ar: 'حَيَّ عَلَى الْفَلَاحِ', tr: "Hayya 'alal-falaah", ta: 'வெற்றியின் பக்கம் வாருங்கள்', n: '2 முறை' },
  { ar: 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ', tr: 'As-salaatu khairum minan-nawm', ta: 'தொழுகை உறக்கத்தை விடச் சிறந்தது', n: 'ஃபஜ்ருக்கு மட்டும், 2 முறை' },
  { ar: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', tr: 'Allahu Akbar, Allahu Akbar', ta: 'அல்லாஹ் மிகப் பெரியவன்', n: '2 முறை' },
  { ar: 'لَا إِلَهَ إِلَّا اللَّهُ', tr: 'Laa ilaaha illallaah', ta: 'அல்லாஹ்வைத் தவிர வணக்கத்திற்குரியவன் வேறு யாருமில்லை', n: '1 முறை' }
];

const TABS = [
  { id: 'times', icon: '🕰️' },
  { id: 'more', icon: '▦' },
  { id: 'set', icon: '⚙️' }
];
const TAB_LABEL = () => ({ times: tx('Today', 'இன்று'), more: tx('Services', 'சேவைகள்'), set: tx('Settings', 'அமைப்புகள்') });

/* ---------------- STATE ---------------- */
const $ = (id) => document.getElementById(id);
const DEFAULTS = {
  city: '', lat: null, lng: null, place: '', fs: 0, lang: 'en', voice: '', // no built-in location: the person picks a city or uses GPS
  method: 'Fajr18', asr: 1, lead: 10, fastRem: false, friRem: false, suhoorRem: true, country: '', adhan: true, alarmScreen: true, dark: null,
  remind: { Fajr: true, Sunrise: false, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
  // Match the local mosque: fixed 'HH:MM' overrides the calculated time; otherwise calculated + adj minutes.
  adj: { Fajr: 0, Sunrise: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 },
  fixed: { Fajr: '', Sunrise: '', Dhuhr: '', Asr: '', Maghrib: '', Isha: '' }
};
let S = load('thw_settings', DEFAULTS);
const savedVer = (S && S.ver) || 0; // settings saved before v2 used the old default method (MWL)
S = Object.assign({}, DEFAULTS, S, {
  remind: Object.assign({}, DEFAULTS.remind, (S && S.remind) || {}),
  adj: Object.assign({}, DEFAULTS.adj, (S && S.adj) || {}),
  fixed: Object.assign({}, DEFAULTS.fixed, (S && S.fixed) || {})
});
S.asr = 1; // Asar when the shadow equals the object (1x).
S.adhan = S.adhan !== false; // master switch for the Adhan
if (savedVer < 2 && S.method === 'MWL') S.method = 'Fajr18'; // move old default once
if (S.method === 'TNTJ') S.method = 'Fajr18'; // renamed method
// v3: the calculation is now exact to the minute, so the old +1 Fajr/Maghrib default is dropped once.
if (savedVer < 3 && S.adj.Fajr === 1 && S.adj.Maghrib === 1 && !S.adj.Sunrise && !S.adj.Dhuhr && !S.adj.Asr && !S.adj.Isha) S.adj = Object.assign({}, DEFAULTS.adj);
// v4: no built-in mosque times any more (they were one mosque's jamaat times). Clear them once if they are still the old defaults.
if (savedVer < 4 && S.fixed.Dhuhr === '12:45' && S.fixed.Asr === '16:00' && S.fixed.Isha === '20:00' && !S.fixed.Fajr && !S.fixed.Maghrib && !S.fixed.Sunrise) S.fixed = Object.assign({}, DEFAULTS.fixed);
// v5: older versions could leave mosque (jamaat) adjustments behind; start from the calculated times once.
if (savedVer < 5) { S.fixed = Object.assign({}, DEFAULTS.fixed); S.adj = Object.assign({}, DEFAULTS.adj); }
S.ver = 7; if (S.lang !== 'en') S.lang = 'ta';
setNames();
if (!Prayer.METHODS[S.method]) S.method = 'Fajr18';
/* Theme: follows the phone (light/dark) until the moon button is tapped. */
function isDark() { return S.dark === null || S.dark === undefined ? !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : !!S.dark; }
function applyTheme() {
  if (document.body && document.body.classList) document.body.classList.toggle('dark', isDark());
  const b = document.getElementById('themeBtn');
  if (b) b.textContent = isDark() ? '☀️' : '🌙';
  try { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', isDark() ? '#091410' : '#065f46'); } catch (e) {}
}
let fired = load('thw_fired', {});
let praySub = null, moreSub = null, setSub = null, duaOpen = null;
let tab = 'times', selPrayer = 'Fajr', duaFilter = 'after', playingId = null, copiedId = null;
const rafu = { t1: false, t2: false, t3: false, t4: false };
let deferredInstall = null;
const cache = {};

/* Native (Capacitor APK) detection: use Android scheduled notifications so reminders work when the app is closed. */
const CAP = window.Capacitor;
const NATIVE = !!(CAP && CAP.isNativePlatform && CAP.isNativePlatform());
const LN = NATIVE && CAP.Plugins ? CAP.Plugins.LocalNotifications : null;
let ATHST = null;
const ATH = NATIVE && CAP.Plugins ? CAP.Plugins.Athan : null; /* native full-screen Adhan alarm (android-athan/) */
let nativePerm = 'default';
let nativeTimer = null;

function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
function save() {
  try { localStorage.setItem('thw_settings', JSON.stringify(S)); } catch (e) {}
  if (LN) { clearTimeout(nativeTimer); nativeTimer = setTimeout(scheduleNative, 600); }
}
function saveFired() { try { localStorage.setItem('thw_fired', JSON.stringify(fired)); } catch (e) {} }

/* ---------------- PRAYER TIME HELPERS ---------------- */
function dayKey(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function hasLoc() { return !!S.city && typeof S.lat === 'number' && typeof S.lng === 'number'; }
function timesFor(d) {
  if (!hasLoc()) return { Fajr: null, Sunrise: null, Dhuhr: null, Asr: null, Maghrib: null, Isha: null };
  const k = dayKey(d) + '|' + S.lat + '|' + S.lng + '|' + S.method + '|' + S.asr + '|' + JSON.stringify(S.adj) + JSON.stringify(S.fixed);
  if (!cache[k]) {
    for (const x in cache) delete cache[x];
    const t = Prayer.computeTimes(d, S.lat, S.lng, S.method, S.asr);
    for (const key of TIME_KEYS) {
      const fx = S.fixed[key];
      if (/^\d{2}:\d{2}$/.test(fx)) {
        const [h, m] = fx.split(':').map(Number);
        t[key] = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0, 0);
      } else if (t[key] && S.adj[key]) t[key] = new Date(t[key].getTime() + S.adj[key] * 60000);
    }
    cache[k] = t;
  }
  return cache[k];
}
function fmt(d) {
  return d ? d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }) : '--';
}
function nextPrayer(now) {
  const t0 = new Date(now), t1 = new Date(now.getTime() + 86400000);
  for (const day of [t0, t1]) {
    const t = timesFor(day);
    for (const k of TIME_KEYS) if (t[k] && t[k] > now) return { key: k, at: t[k] };
  }
  return null;
}
/* Hijri date by the Umm al-Qura calendar (calculated). Local moon sighting can differ by a day. */
const HIJRI_MONTHS = ['முஹர்ரம்', 'ஸஃபர்', 'ரபீஉல் அவ்வல்', 'ரபீஉல் ஆகிர்', 'ஜுமாதல் ஊலா', 'ஜுமாதல் ஆகிரா', 'ரஜப்', 'ஷஃபான்', 'ரமளான்', 'ஷவ்வால்', 'துல்கஃதா', 'துல்ஹஜ்'];
function hijriParts(d) {
  try {
    const p = {};
    new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(new Date(d.getTime() + (S.hadj || 0) * 86400000)).forEach((x) => { p[x.type] = x.value; });
    const r = { d: parseInt(p.day, 10), m: parseInt(p.month, 10), y: parseInt(p.year, 10) };
    return r.m >= 1 && r.m <= 12 ? r : null;
  } catch (e) { return null; }
}
function hijriString(now) {
  // The Islamic day begins at sunset, so after Maghrib show the next date.
  const t = timesFor(now);
  const d = t && t.Maghrib && now >= t.Maghrib ? new Date(now.getTime() + 86400000) : now;
  const h = hijriParts(d); if (!h) return '';
  return S.lang === 'en' ? h.d + ' ' + HIJRI_MONTHS_EN[h.m - 1] + ' ' + h.y + ' AH' : h.d + ' ' + HIJRI_MONTHS[h.m - 1] + ' ' + h.y + ' ஹிஜ்ரி';
}
const noonOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
/* Sunnah fasting day (civil date) or null. Ramadan, Eid days and the days after Adha are not listed here. */
function fastReason(date) {
  const h = hijriParts(noonOf(date)); if (!h) return null;
  if (h.m === 9 || (h.m === 10 && h.d === 1) || (h.m === 12 && h.d >= 10 && h.d <= 13)) return null;
  if (h.m === 12 && h.d === 9) return { en: 'Day of Arafah', ta: 'அரஃபா நாள்', ref: 'Muslim 1162 (API 2151)' };
  if (h.m === 1 && h.d === 10) return { en: 'Ashura (10 Muharram)', ta: 'ஆஷூரா (முஹர்ரம் 10)', ref: 'Muslim 1162 (API 2151)' };
  if (h.m === 1 && h.d === 9) return { en: 'Tasua (9 Muharram)', ta: 'தாசூஆ (முஹர்ரம் 9)', ref: 'Muslim 1134 (API 2088)' };
  if (h.d >= 13 && h.d <= 15) return { en: 'Fast 3 days of the month', ta: 'மாதம் 3 நாட்கள் நோன்பு', ref: 'Bukhari 1981' };
  const w = date.getDay();
  if (w === 1) return { en: 'Monday', ta: 'திங்கள்', ref: 'Muslim 1162 (API 2153)' };
  return null;
}
/* Card for today (or tomorrow after Maghrib): Ramadan times or a sunnah fast. */
function dayNote(now) {
  const t = timesFor(now);
  const after = t && t.Maghrib && now >= t.Maghrib;
  const day = after ? new Date(now.getTime() + 86400000) : now;
  const label = after ? tx('Tomorrow', 'நாளை') : tx('Today', 'இன்று');
  const h = hijriParts(noonOf(day)); if (!h) return '';
  if (h.m === 9) {
    const td = timesFor(day);
    return `<div class="card soft"><b>🌙 ${tx('Ramadan', 'ரமளான்')} - ${tx('day', 'நாள்')} ${h.d}</b> <span class="mute">(${label})</span>
      <div class="mute" style="margin-top:4px">${tx('Suhoor ends (Fajr)', 'ஸஹர் முடிவு (ஃபஜ்ர்)')}: <b>${fmt(td.Fajr)}</b> • ${tx('Iftar (Maghrib)', 'இஃப்தார் (மக்ரிப்)')}: <b>${fmt(td.Maghrib)}</b></div>
      <div class="mute" style="font-size:12px">${tx('Eat suhoor - there is blessing in it (Bukhari 1923).', 'ஸஹர் உண்ணுங்கள்; அதில் பரக்கத் உள்ளது (புகாரி 1923).')}</div></div>`;
  }
  const fr = fastReason(day);
  if (!fr) return '';
  return `<div class="card soft"><b>🌿 ${label}: ${tx('a sunnah fasting day', 'சுன்னத் நோன்பு நாள்')}</b> <span class="mute">- ${tx(fr.en, fr.ta)} (${fr.ref})</span></div>`;
}
function currentActiveKey(t, now) {
  if (!t) return null;
  const inr = (a, b) => t[a] && t[b] && now >= t[a] && now < t[b];
  if (t.Fajr && now < t.Fajr) return 'Isha'; // after midnight, before Fajr: still last night's Isha
  if (inr('Fajr', 'Sunrise')) return 'Fajr';
  if (inr('Dhuhr', 'Asr')) return 'Dhuhr';
  if (inr('Asr', 'Maghrib')) return 'Asr';
  if (inr('Maghrib', 'Isha')) return 'Maghrib';
  if (t.Isha && now >= t.Isha) return 'Isha';
  return null;
}
function countdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return S.lang === 'en' ? (h ? h + 'h ' : '') + m + 'm ' + String(x).padStart(2, '0') + 's' : (h ? h + ' மணி ' : '') + m + ' நிமி ' + String(x).padStart(2, '0') + ' வி';
}

/* ---------------- NOTIFICATIONS ---------------- */
function notifState() {
  if (NATIVE) return LN ? nativePerm : 'unsupported';
  return 'Notification' in window ? Notification.permission : 'unsupported';
}

/* Home-screen widget reads this JSON (stored by @capacitor/preferences) - see android-widget/. */
async function updateWidget() {
  const PREF = CAP && CAP.Plugins ? CAP.Plugins.Preferences : null;
  if (!NATIVE || !PREF || !hasLoc()) return;
  try {
    const days = [];
    for (let d = 0; d < 8; d++) {
      const dt = new Date(Date.now() + d * 86400000), t = timesFor(dt), o = {};
      TIME_KEYS.forEach((k) => { if (t[k]) o[k] = t[k].getTime(); });
      o.m = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
      const h = hijriParts(noonOf(dt)); o.h = h ? h.d + ' ' + (S.lang === 'en' ? HIJRI_MONTHS_EN : HIJRI_MONTHS)[h.m - 1] : '';
      days.push(o);
    }
    await PREF.set({ key: 'thw_widget', value: JSON.stringify({ place: S.place, names: KEY_LABEL, nextLabel: tx('Next', 'அடுத்தது'), days, at: Date.now() }) });
  } catch (e) {}
}

/* ---- native scheduling (Android alarms via @capacitor/local-notifications) ---- */
async function scheduleNative() {
  if (!LN) return;
  try {
    const p = await LN.checkPermissions();
    nativePerm = p.display === 'granted' ? 'granted' : p.display === 'denied' ? 'denied' : 'default';
    if (nativePerm !== 'granted') { updateWidget(); return; }
    const pend = await LN.getPending();
    if (pend && pend.notifications && pend.notifications.length) await LN.cancel({ notifications: pend.notifications });
    const items = [], alarms = [], now = Date.now(), useAth = !!ATH && S.alarmScreen !== false;
    for (let d = 0; d < 7; d++) {
      const t = timesFor(new Date(now + d * 86400000));
      TIME_KEYS.forEach((k, i) => {
        if (!S.remind[k] || !t[k]) return;
        const at = t[k].getTime() - S.lead * 60000;
        const adhanHere = S.adhan && k !== 'Sunrise';
        // With "at prayer time" + Adhan on, the Adhan notification replaces the plain reminder.
        if (at > now + 1000 && !(S.lead === 0 && adhanHere)) {
          items.push({
            id: 1000 + d * 10 + i,
            title: remindTitle(k),
            body: remindBody(k, t[k]),
            schedule: { at: new Date(at), allowWhileIdle: true },
            channelId: 'prayer'
          });
        }
        if (adhanHere && t[k].getTime() > now + 1000 && useAth) {
          alarms.push({ id: 5000 + d * 10 + i, at: t[k].getTime(), title: KEY_LABEL[k], time: fmt(t[k]), tagline: athanTagline(), sound: athanSound(k), stop: tx('Stop', 'நிறுத்து') });
        } else if (adhanHere && t[k].getTime() > now + 1000) {
          items.push({
            id: 5000 + d * 10 + i,
            title: KEY_LABEL[k] + tx(' - time for prayer', ' - தொழுகை நேரம்'),
            body: tx('Adhan • ', 'அதான் • ') + fmt(t[k]),
            schedule: { at: new Date(t[k].getTime()), allowWhileIdle: true },
            channelId: adhanChannel(k)
          });
        }
      });
    }
    for (let d = 0; d < 7; d++) {
      const dt = new Date(now + d * 86400000), t = timesFor(dt), hp = hijriParts(noonOf(dt));
      if (S.suhoorRem && hp && hp.m === 9 && t.Fajr && t.Fajr.getTime() - 40 * 60000 > now + 1000) {
        items.push({ id: 7000 + d, title: tx('Suhoor time', 'ஸஹர் நேரம்'), body: tx('Fajr at ', 'ஃபஜ்ர் ') + fmt(t.Fajr), schedule: { at: new Date(t.Fajr.getTime() - 40 * 60000), allowWhileIdle: true }, channelId: 'prayer' });
      }
      if (S.fastRem && t.Maghrib) {
        const fr = fastReason(new Date(dt.getTime() + 86400000)), at = t.Maghrib.getTime() + 30 * 60000;
        if (fr && at > now + 1000) items.push({ id: 7100 + d, title: tx('Tomorrow: a sunnah fast', 'நாளை: சுன்னத் நோன்பு'), body: tx(fr.en, fr.ta) + ' (' + fr.ref + ')', schedule: { at: new Date(at), allowWhileIdle: true }, channelId: 'prayer' });
      }
      if (S.friRem && dt.getDay() === 5 && t.Dhuhr && t.Dhuhr.getTime() - 120 * 60000 > now + 1000) {
        items.push({ id: 7200 + d, title: tx('Jumma today', 'இன்று ஜும்ஆ'), body: tx('Bathe, wear clean clothes, go early, and send salawat on the Prophet', 'குளித்து, தூய ஆடை அணிந்து, முன்னதாகச் செல்லுங்கள்; நபி ﷺ மீது ஸலவாத் அதிகம் கூறுங்கள்'), schedule: { at: new Date(t.Dhuhr.getTime() - 120 * 60000), allowWhileIdle: true }, channelId: 'prayer' });
      }
    }
    if (ATH) {
      try { await ATH.schedule({ alarms: useAth ? alarms : [] }); }
      catch (e) { // the native alarm failed: fall back to normal Adhan notifications
        alarms.forEach((a) => items.push({ id: a.id, title: a.title + tx(' - time for prayer', ' - தொழுகை நேரம்'), body: tx('Adhan • ', 'அதான் • ') + a.time, schedule: { at: new Date(a.at), allowWhileIdle: true }, channelId: 'prayer' }));
      }
    }
    if (items.length) await LN.schedule({ notifications: items });
  } catch (e) { /* ignore - will retry next open */ }
  updateWidget();
}
async function initNative() {
  if (!LN) return;
  athanStatus();
  await loadAdhan();
  const ch = { importance: 5, visibility: 1, vibration: true };
  try { await LN.createChannel(Object.assign({ id: 'prayer', name: 'தொழுகை நினைவூட்டல்' }, ch)); } catch (e) {}
  // A channel's sound is fixed once it exists, so every voice has its own channel id; older ids are removed.
  for (const id of ['adhan', 'adhan-fajr', 'adhan-s']) { try { await LN.deleteChannel({ id }); } catch (e) {} }
  if (ADH.bundled) { try { await LN.deleteChannel({ id: 'adhan-d' }); } catch (e) {} }
  for (const v of ADH.voices) { try { await LN.createChannel(Object.assign({ id: 'adhan-v-' + v.id, name: 'அதான் - ' + v.label, sound: rawName(v.file) + '.mp3' }, ch)); } catch (e) {} }
  if (!ADH.bundled) { try { await LN.createChannel(Object.assign({ id: 'adhan-d', name: 'அதான்' }, ch)); } catch (e) {} }
  try { if (ADH.fajrFile) await LN.createChannel(Object.assign({ id: 'adhan-fajr-s', name: 'அதான் (ஃபஜ்ர்)', sound: rawName(ADH.fajrFile) + '.mp3' }, ch)); } catch (e) {}
  await scheduleNative();
  updateWidget();
}

/* ---------------- ADHAN ---------------- */
// Put your own audio in adhan/adhan.mp3 (and optionally adhan/adhan-fajr.mp3). If none is found, a soft chime is played instead.
const ADH = { main: false, fajr: false, voices: [], fajrFile: '', custom: { main: null, fajr: null }, urls: {}, audio: null, ctx: null, playing: false, loaded: false, bundled: false, fajrBundled: false, diag: '' };
/* The person's own Adhan files (picked from the phone) are kept in IndexedDB. */
function idb() { return new Promise((res, rej) => { const r = indexedDB.open('thw', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
async function idbGet(k) {
  try { const d = await idb(); return await new Promise((res) => { const q = d.transaction('f').objectStore('f').get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; }
}
async function idbSet(k, v) {
  try { const d = await idb(); await new Promise((res, rej) => { const tx = d.transaction('f', 'readwrite'); if (v) tx.objectStore('f').put(v, k); else tx.objectStore('f').delete(k); tx.oncomplete = res; tx.onerror = rej; }); return true; } catch (e) { return false; }
}
const rawName = (f) => f.replace(/\.[^.]+$/, '').replace(/-/g, '_').toLowerCase();
/* adhan/voices.json lists the bundled recordings, so nothing big is downloaded at start-up. */
async function loadVoices() {
  try {
    const r = await fetch('adhan/voices.json', { cache: 'no-cache' });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (!r.ok || ct.indexOf('text/html') >= 0) return { voices: [], fajr: '' };
    const j = await r.json();
    return { voices: Array.isArray(j.voices) ? j.voices : [], fajr: j.fajr || '' };
  } catch (e) { return { voices: [], fajr: '' }; }
}
function loadAdhan() {
  // One shared promise, so callers that arrive while the list is still being read wait for the result.
  if (!ADH.p) ADH.p = (async () => {
    const [v, cm, cf] = await Promise.all([loadVoices(), idbGet('adhan'), idbGet('adhan-fajr')]);
    ADH.voices = v.voices; ADH.fajrFile = v.fajr; ADH.custom = { main: cm, fajr: cf };
    ADH.bundled = ADH.voices.length > 0; ADH.fajrBundled = !!ADH.fajrFile;
    ADH.main = ADH.bundled || !!cm; ADH.fajr = ADH.fajrBundled || !!cf;
    ADH.loaded = true;
  })();
  return ADH.p;
}
async function adhanUrl(file) {
  if (ADH.urls[file]) return ADH.urls[file];
  const r = await fetch('adhan/' + file);
  if (!r.ok) return '';
  ADH.urls[file] = URL.createObjectURL(await r.blob());
  return ADH.urls[file];
}
function voiceOf() { return ADH.voices.find((x) => x.id === S.voice) || ADH.voices[0] || null; }
function athanTagline() { return tx('Hurry to the prayer! Hurry to success!', 'தொழுகைக்கு வாருங்கள்! வெற்றிக்கு வாருங்கள்!'); }
function athanSound(k) {
  if (k === 'Fajr' && ADH.fajrBundled && ADH.fajrFile) return rawName(ADH.fajrFile);
  const v = voiceOf();
  return ADH.bundled && v && v.file ? rawName(v.file) : '';
}
async function athanTest() {
  if (!ATH) return;
  try { await ATH.test({ seconds: 10, title: KEY_LABEL.Isha, time: fmt(new Date(Date.now() + 10000)), tagline: athanTagline(), sound: athanSound('Isha'), stop: tx('Stop', 'நிறுத்து') }); toast(tx('Lock the screen. The Adhan screen comes in 10 seconds.', 'திரையைப் பூட்டுங்கள். 10 வினாடியில் அதான் திரை வரும்.')); }
  catch (e) { toast(tx('Could not start the test', 'சோதனையைத் தொடங்க முடியவில்லை')); }
}
async function athanStatus() {
  if (!ATH) return;
  try { ATH.status().then((r) => { ATHST = r; if (tab === 'set' || tab === 'more') render(); }); } catch (e) {}
}
function adhanChannel(k) {
  if (k === 'Fajr' && ADH.fajrBundled) return 'adhan-fajr-s';
  const v = voiceOf();
  return ADH.bundled && v ? 'adhan-v-' + v.id : 'adhan-d';
}
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ADH.ctx = ADH.ctx || new AC();
    const c = ADH.ctx; if (c.state === 'suspended') c.resume();
    [523.25, 659.25, 783.99, 659.25, 523.25].forEach((f, i) => {
      const o = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + i * 0.7;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.65);
      o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + 0.7);
    });
    return true;
  } catch (e) { return false; }
}
function stopAdhan() {
  const was = ADH.playing || ADH.audio;
  if (ADH.audio) { try { ADH.audio.pause(); } catch (e) {} ADH.audio = null; }
  ADH.playing = false;
  if (was && tab === 'more') render();
}
async function playAdhan(key) {
  await loadAdhan();
  let url = '';
  try {
    if (key === 'Fajr' && (ADH.custom.fajr || ADH.fajrFile)) url = ADH.custom.fajr ? URL.createObjectURL(ADH.custom.fajr) : await adhanUrl(ADH.fajrFile);
    else if (ADH.custom.main) url = URL.createObjectURL(ADH.custom.main);
    else { const v = voiceOf(); if (v) url = await adhanUrl(v.file); }
  } catch (e) { url = ''; }
  if (!url) { if (!chime()) toast(tx('No Adhan file in the app', 'அதான் ஒலிக்கோப்பு ஆப்பில் இல்லை')); else toast(tx('No Adhan file - played a chime', 'அதான் கோப்பு இல்லை - மணி ஒலி ஒலித்தது')); return true; }
  if (ADH.audio) { try { ADH.audio.pause(); } catch (e) {} }
  const a = new Audio(url);
  a.onended = a.onerror = () => { if (ADH.audio === a) stopAdhan(); };
  ADH.audio = a;
  try { await a.play(); ADH.playing = true; if (tab === 'more') render(); return true; }
  catch (e) { ADH.audio = null; return false; } // browsers block sound until the person taps the page
}
async function showNotification(title, body, tag) {
  title = L(title); body = L(body);
  toast(body);
  banner(title + ' - ' + body);
  try { navigator.vibrate && navigator.vibrate([250, 120, 250]); } catch (e) {}
  if (notifState() !== 'granted') return;
  const opts = { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: tag || 'namaz', renotify: true, vibrate: [250, 120, 250] };
  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) await reg.showNotification(title, opts); else new Notification(title, opts);
  } catch (e) { try { new Notification(title, opts); } catch (e2) {} }
}
function checkReminders() {
  if (LN) return; // native alarms handle reminders
  const now = new Date();
  let changed = false;
  for (const day of [now, new Date(now.getTime() + 86400000)]) {
    const t = timesFor(day);
    for (const k of TIME_KEYS) {
      const adhanHere = S.adhan && k !== 'Sunrise' && t[k];
      if (adhanHere) {
        const aid = dayKey(day) + '-' + k + '-adhan';
        if (now.getTime() >= t[k].getTime() && now.getTime() < t[k].getTime() + 180000 && !fired[aid]) {
          fired[aid] = 1; changed = true;
          playAdhan(k).then((ok) => {
            if (ok) banner('📢 ' + KEY_LABEL[k] + tx(' - time for prayer (', ' - தொழுகை நேரம் (') + fmt(t[k]) + ')', true);
            else showNotification(remindTitle(k), remindBody(k, t[k]) + tx(' - tap to hear the Adhan', ' - அதான் கேட்கத் தொடவும்'), 'thw-' + k);
          });
        }
      }
      if (!S.remind[k] || !t[k]) continue;
      if (S.lead === 0 && adhanHere) continue; // the Adhan itself is the "at prayer time" reminder
      const at = t[k].getTime() - S.lead * 60000;
      const id = dayKey(day) + '-' + k + '-' + S.lead;
      if (now.getTime() >= at && now.getTime() < at + 180000 && !fired[id]) {
        fired[id] = 1; changed = true;
        showNotification(remindTitle(k), remindBody(k, t[k]), 'thw-' + k);
      }
    }
  }
  if (changed) {
    const keys = Object.keys(fired);
    if (keys.length > 60) keys.slice(0, keys.length - 40).forEach((k) => delete fired[k]);
    saveFired();
  }
}
async function enableNotif() {
  if (LN) {
    try {
      const p = await LN.requestPermissions();
      nativePerm = p.display === 'granted' ? 'granted' : 'denied';
      if (nativePerm === 'granted') {
        try {
          const ex = await LN.checkExactNotificationSetting();
          if (ex && ex.exact_alarm !== 'granted') {
            toast('தொழுகை நேரத்தில் அலாரம் அடிக்க "Alarms & reminders" அனுமதியை வழங்கவும்');
            await LN.changeExactNotificationSetting();
          }
        } catch (e) {}
        await scheduleNative();
      }
      toast(nativePerm === 'granted' ? 'நினைவூட்டல் இயக்கப்பட்டது ✓' : 'அறிவிப்புகள் தடுக்கப்பட்டுள்ளன - Android செட்டிங்ஸில் அனுமதிக்கவும்');
    } catch (e) { toast('நினைவூட்டலை இயக்க முடியவில்லை'); }
    render(); return;
  }
  if (!('Notification' in window)) { toast('இந்த பிரவுசர் அறிவிப்புகளை ஆதரிக்கவில்லை'); return; }
  const p = await Notification.requestPermission();
  toast(p === 'granted' ? 'நினைவூட்டல் இயக்கப்பட்டது ✓' : 'அறிவிப்புகள் தடுக்கப்பட்டுள்ளன - பிரவுசர்/தள செட்டிங்ஸில் அனுமதிக்கவும்');
  render();
}

/* ---------------- LOCATION ---------------- */
function useGPS() {
  if (!navigator.geolocation) { toast(tx('Location is not supported here - search your city', 'இருப்பிடம் ஆதரிக்கப்படவில்லை - ஊரைத் தேடவும்')); return; }
  toast(tx('Finding your location...', 'உங்கள் இருப்பிடத்தைத் தேடுகிறது...'));
  navigator.geolocation.getCurrentPosition((p) => {
    S.lat = +p.coords.latitude.toFixed(4); S.lng = +p.coords.longitude.toFixed(4);
    S.city = 'gps'; S.country = ''; S.place = 'என் இருப்பிடம் (' + S.lat + ', ' + S.lng + ')';
    save(); render(); toast('இருப்பிடம் அமைக்கப்பட்டது ✓'); reverseGeocode();
  }, (err) => toast(err && err.code === 1 ? tx('Location is blocked. Allow it in phone settings, or search your city below.', 'இருப்பிடம் தடுக்கப்பட்டுள்ளது. போன் செட்டிங்ஸில் அனுமதிக்கவும் அல்லது கீழே ஊரைத் தேடவும்.') : tx('Could not get your location. Go outside / turn on GPS, or search your city.', 'இருப்பிடம் கிடைக்கவில்லை. GPS-ஐ இயக்கவும் அல்லது ஊரைத் தேடவும்.')), { enableHighAccuracy: false, timeout: 20000, maximumAge: 600000 });
}
/* No network call: the place name is the nearest listed city (within 60 km) or the coordinates. */
function reverseGeocode() {
  const R = Math.PI / 180;
  let best = null, bestC = '', bd = 1e9;
  for (const cc of CITYDB) {
    const c = cc[0], la = cc[2], ln = cc[3];
    const a = Math.sin(((la - S.lat) * R) / 2) ** 2 + Math.cos(S.lat * R) * Math.cos(la * R) * Math.sin(((ln - S.lng) * R) / 2) ** 2;
    const d = 12742 * Math.asin(Math.sqrt(a));
    if (d < bd) { bd = d; best = c; bestC = cc[1]; }
  }
  if (best && bd <= 40 && S.city === 'gps') { S.place = best + ' (GPS)'; S.country = bestC || ''; save(); if (tab === 'times' || tab === 'more') render(); }
}

/* ---------------- UI HELPERS ---------------- */
let toastT, bannerT;
function toast(msg) {
  const el = $('toast'); el.textContent = L(msg); el.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), 2400);
}
function banner(msg, stopBtn) {
  $('bannerTxt').textContent = L(msg); $('banner').classList.remove('hidden');
  $('bannerX').textContent = stopBtn ? tx('⏹ Stop', '⏹ நிறுத்து') : tx('OK', 'சரி');
  clearTimeout(bannerT); bannerT = setTimeout(() => $('banner').classList.add('hidden'), 30000);
}
async function copyText(text, id) {
  try { await navigator.clipboard.writeText(text); } catch (e) {
    const a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select();
    try { document.execCommand('copy'); } catch (e2) {} a.remove();
  }
  copiedId = id; toast('நகலெடுக்கப்பட்டது ✓'); render(); setTimeout(() => { copiedId = null; if (tab === 'duas' || tab === 'pray' || tab === 'more') render(); }, 1500);
}
function speak(id) {
  const d = DUAS.find((x) => x.id === id);
  if (!d || !('speechSynthesis' in window)) { toast('இந்த பிரவுசரில் குரல் வசதி இல்லை'); return; }
  const ss = window.speechSynthesis;
  if (playingId === id) { ss.cancel(); playingId = null; render(); return; }
  ss.cancel();
  const voices = ss.getVoices();
  const ar = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
  const en = voices.find((v) => v.lang === 'en-IN') || voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  const u = new SpeechSynthesisUtterance(ar ? d.arabic : d.tr);
  if (ar) { u.voice = ar; u.lang = ar.lang; u.rate = 0.7; }
  else {
    if (en) { u.voice = en; u.lang = en.lang; } else u.lang = 'en-IN';
    u.rate = 0.75;
    toast('இந்த போனில் அரபி குரல் இல்லை - ஆங்கில உச்சரிப்பு வாசிக்கப்படும். Settings > Text-to-speech-இல் Arabic-ஐ நிறுவவும்.');
  }
  u.onend = u.onerror = () => { if (playingId === id) { playingId = null; render(); } };
  playingId = id; render(); ss.speak(u);
}
if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = () => {};

/* ---------------- VIEWS ---------------- */
function duaCard(d) {
  const copyTxt = `${d.arabic}\n${d.tr}\n${d.en}\n[${d.ref}]`;
  return `<div class="card dua" style="margin:0">
    <div class="head"><div><h3>${d.title}</h3><div class="ref">${d.ref}</div></div><span class="tag">${DUA_LABEL[d.cat] || d.cat}</span></div>
    <div class="ar" dir="rtl" lang="ar">${d.arabic}</div>
    <div class="tr"><b>ஆங்கில உச்சரிப்பு (Transliteration)</b>${d.tr}</div>
    ${d.tp ? `<div class="tr" lang="ta"><b>தமிழ் உச்சரிப்பு</b>${d.tp}</div>` : ''}
    <div class="en">${d.en}</div>
    ${d.ta ? `<div class="tr" lang="ta"><b>தமிழ்</b>${d.ta}</div>` : ''}
    <div class="acts">
      <button class="ab ${copiedId === d.id ? 'on' : ''}" data-act="copy" data-id="${d.id}">${copiedId === d.id ? '✓ நகலெடுக்கப்பட்டது' : '📋 நகலெடு'}</button>
      <button class="ab ${playingId === d.id ? 'play' : ''}" data-act="speak" data-id="${d.id}">${playingId === d.id ? '⏸ நிறுத்து' : '🔊 மெதுவாகக் கேட்க'}</button>
    </div></div>`;
}

/* ---------------- QIBLA COMPASS ---------------- */
const compass = { on: false, h: null, last: 0, hit: false };
function compassHandler(e) {
  let h = null;
  if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading; // iOS (already clockwise from north)
  else if (e.absolute === true && typeof e.alpha === 'number') h = 360 - e.alpha; // Android absolute orientation
  if (h == null || isNaN(h)) return;
  const now = Date.now(); if (now - compass.last < 50) return; compass.last = now;
  h = ((h % 360) + 360) % 360;
  compass.h = compass.h == null ? h : (() => { let d = ((h - compass.h + 540) % 360) - 180; return (compass.h + d * 0.35 + 360) % 360; })(); // smoothing
  const q = Prayer.qibla(S.lat, S.lng);
  const rose = document.getElementById('qRose'), st = document.getElementById('qStat');
  if (rose) rose.style.transform = 'rotate(' + (-compass.h).toFixed(1) + 'deg)';
  const diff = Math.abs(((q - compass.h + 540) % 360) - 180);
  const hit = diff <= 4;
  const dial = document.getElementById('qDial'); if (dial) dial.classList.toggle('hit', hit);
  if (st) st.textContent = hit ? '✓ கிப்லா திசை இதுவே' : (diff < 20 ? 'கிட்டிவிட்டது - ' + Math.round(diff) + '° வித்தியாசம்' : '');
  if (hit && !compass.hit) { try { navigator.vibrate && navigator.vibrate(60); } catch (x) {} }
  compass.hit = hit;
}
async function compassToggle() {
  if (compass.on) {
    window.removeEventListener('deviceorientationabsolute', compassHandler, true);
    window.removeEventListener('deviceorientation', compassHandler, true);
    compass.on = false; compass.h = null; render(); return;
  }
  try {
    const DO = window.DeviceOrientationEvent;
    if (DO && typeof DO.requestPermission === 'function') { const r = await DO.requestPermission(); if (r !== 'granted') { toast('திசைகாட்டி அனுமதி மறுக்கப்பட்டது'); return; } }
  } catch (e) { toast('திசைகாட்டி அனுமதி கிடைக்கவில்லை'); return; }
  if (!('ondeviceorientationabsolute' in window) && !('ondeviceorientation' in window)) { toast('இந்த சாதனத்தில் திசைகாட்டி சென்சார் இல்லை'); return; }
  compass.on = true; compass.h = null;
  window.addEventListener('deviceorientationabsolute', compassHandler, true);
  window.addEventListener('deviceorientation', compassHandler, true); // iOS, and Android fallback (handler ignores non-absolute events)
  render();
  setTimeout(() => { if (compass.on && compass.h == null) toast('திசைகாட்டி சிக்னல் இல்லை - போனை எண்-8 வடிவில் அசைக்கவும்'); }, 3000);
}

function viewSetup() {
  return `<div class="card hero"><div class="hn">🕌 ISNAD</div>
    <p style="margin:10px 0 4px;font-size:16px">${tx('Welcome! Tap the button to see the prayer times for where you are.', 'வரவேற்கிறோம்! நீங்கள் இருக்கும் இடத்துக்கான தொழுகை நேரங்களைக் காண கீழே தொடவும்.')}</p>
    <div class="row" style="justify-content:center"><button class="pri" data-act="gps">📍 ${tx('Use my location (GPS)', 'என் இருப்பிடத்தைப் பயன்படுத்து (GPS)')}</button></div></div>
  <div class="card"><h3>🔎 ${tx('Or search a city or country', 'அல்லது ஊர் / நாட்டைத் தேடுங்கள்')}</h3>
    <label class="field"><input type="search" id="citySearch" autocomplete="off" placeholder="Dubai, Colombo, London, கோவை..."></label>
    <div class="list" id="cityRes">${cityRows('')}</div></div>
  <div class="card"><details class="ad"><summary>🧭 ${tx('Enter coordinates yourself', 'ஆயத்தொலைவுகளை நீங்களே உள்ளிடுக')}</summary>
    <label class="field">${tx('Name (optional)', 'பெயர் (விருப்பம்)')}<input type="text" id="cName"></label>
    <label class="field">${tx('Latitude (e.g. 25.2048)', 'அட்சரேகை (எ.கா. 25.2048)')}<input type="text" inputmode="decimal" id="cLat"></label>
    <label class="field">${tx('Longitude (e.g. 55.2708)', 'தீர்க்கரேகை (எ.கா. 55.2708)')}<input type="text" inputmode="decimal" id="cLng"></label>
    <div class="row"><button class="sec" data-act="setcoords">${tx('Save', 'சேமி')}</button></div></details></div>
  <p class="mute" style="text-align:center">${tx('First you will see the calculated times for your place. Matching your mosque is optional (More > Settings).', 'முதலில் உங்கள் இடத்துக்கான கணக்கிட்ட நேரங்கள் காட்டப்படும். பள்ளிவாசல் நேரத்தை பின்னர் அமைக்கலாம் (மேலும் > அமைப்புகள்) - அது விருப்பம் மட்டுமே.')}</p>`;
}
function viewTimes() {
  if (!hasLoc()) return viewSetup();
  const now = new Date(), t = timesFor(now), nx = nextPrayer(now);
  const q = Prayer.qibla(S.lat, S.lng);
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const dir = dirs[Math.round(q / 45) % 8];
  const ns = notifState();
  const cityOpts = Object.keys(CITIES).map((c) => `<option value="${c}" ${S.city === c ? 'selected' : ''}>${c}</option>`).join('');
  const curKey = currentActiveKey(t, now);
  const rows = TIME_KEYS.map((k) => `<tr class="${nx && nx.key === k && dayKey(nx.at) === dayKey(now) ? 'next' : ''} ${curKey === k ? 'active' : ''} ${t[k] && t[k] <= now && curKey !== k ? 'past' : ''}">
      <td>${KEY_LABEL[k]}${curKey === k ? ' <span class="nowc">● இப்போது</span>' : ''}${/^\d{2}:\d{2}$/.test(S.fixed[k]) ? ' <span class="chip">' + tx('jamaat', 'ஜமாஅத்') + '</span>' : ''}</td><td class="t">${fmt(t[k])}</td>
      <td class="r"><input type="checkbox" data-remind="${k}" ${S.remind[k] ? 'checked' : ''} aria-label="${KEY_LABEL[k]} நினைவூட்டு"></td>
      <td class="r">${FARD.includes(k) ? `<button class="trk ${(TR[dayKey(now)] || {})[k] ? 'on' : ''}" data-act="trk" data-k="${k}" data-d="${dayKey(now)}" aria-label="${KEY_LABEL[k]}">✓</button>` : ''}</td></tr>`).join('');
  const notifLine = ns === 'granted' ? '✅ அறிவிப்புகள் அனுமதிக்கப்பட்டுள்ளன'
    : ns === 'denied' ? '⛔ அறிவிப்புகள் தடுக்கப்பட்டுள்ளன - தளம்/ஆப் செட்டிங்ஸில் அனுமதிக்கவும்'
    : ns === 'unsupported' ? 'இங்கு அறிவிப்புகள் ஆதரிக்கப்படவில்லை' : '🔔 அறிவிப்புகள் இன்னும் இயக்கப்படவில்லை';
  const dateLine = now.toLocaleDateString(S.lang === 'en' ? 'en-IN' : 'ta-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hero = nx ? `<div class="card hero"><div class="mute">${dateLine} • 📍 ${S.place}</div><div class="hijri">${hijriString(now) ? '≈ ' + hijriString(now) : ''}</div>
    <button class="gear" data-act="gosettings" aria-label="Settings">⚙️</button><div class="hn">${tx('Next', 'அடுத்தது')}: <b id="heroName">${KEY_LABEL[nx.key]}</b></div>
    <div class="ht" id="heroTime">${fmt(nx.at)}</div><div class="hc" id="heroCount">${tx('in ', 'இன்னும் ')}${countdown(nx.at - now)}</div></div>` : '';
  return `${hero}${dayNote(now)}
  <div class="card"><table class="tbl"><tbody>${rows}</tbody></table>
    <p class="mute">${tx('🔔 reminder • ✓ I prayed', '🔔 நினைவூட்டல் • ✓ தொழுதேன்')}</p>${trSummary(now)}
    ${TIME_KEYS.some((k) => /^\d{2}:\d{2}$/.test(S.fixed[k]) || S.adj[k]) ? `<p class="mute">🕌 ${tx('Mosque times are in use.', 'பள்ளிவாசல் நேரம் பயன்பாட்டில் உள்ளது.')} <button class="sec" data-act="resetadj" style="padding:4px 10px">${tx('Use calculated times', 'கணக்கிட்ட நேரங்கள்')}</button></p>` : ''}</div>
  <details class="more-times"><summary>${tx('More times', 'மேலும் நேரங்கள்')}</summary>${extraTimes(t, now)}</details>
  `;
}

function viewDaily() {
  const sel = PRAYERS.find((p) => p.key === selPrayer) || PRAYERS[0];
  const t = timesFor(new Date());
  const cards = PRAYERS.map((p) => `<button class="pt ${p.key === selPrayer ? 'on' : ''}" data-act="pray" data-key="${p.key}">
      <div class="nm">${p.name}</div><div class="tm">${fmt(t[p.key])}</div><small>${p.time}</small>
      <span class="chip">ஃபர்ளு ${p.fard}</span><span class="chip">${p.total}</span></button>`).join('');
  const checks = [['t1', '1. தக்பீரத்துல் இஹ்ராம் - தொடக்கம்'], ['t2', '2. ருகூஉக்குச் செல்லும்போது'], ['t3', '3. ருகூஉவிலிருந்து எழும்போது - ஸமிஅல்லாஹு'], ['t4', '4. இரண்டாம் ரக்அத் அத்தஹிய்யாத்துக்குப் பின் மூன்றாம் ரக்அத்துக்கு எழும்போது']]
    .map(([k, l]) => `<label class="chk ${rafu[k] ? 'done' : ''}"><input type="checkbox" data-rafu="${k}" ${rafu[k] ? 'checked' : ''}><span>${l}</span></label>`).join('');
  const steps = [
    'தக்பீர் - அல்லாஹு அக்பர் - கைகளைத் தோள்/காது வரை உயர்த்தவும் - கை உயர்த்துதல் #1',
    'நிலை (கியாம்) - வலக்கையை இடக்கை மேல் நெஞ்சின் மீது (வயிற்றின் மீது அல்ல) வைக்கவும் - புகாரி 740 - ஸஜ்தா செய்யும் இடத்தைப் பார்க்கவும்',
    "தொடக்க துஆ (இஸ்திஃப்தாஹ்): அல்லாஹும்ம பாஇத் பைனீ வ பைன கத்தாயாய... - புகாரி 744, முஸ்லிம் 598 (API 1049) - பின்னர் அஊது பில்லாஹ், பிஸ்மில்லாஹ், அல்ஃபாத்திஹா + ஒரு சிறிய அத்தியாயம் (குல் ஹுவல்லாஹு அஹத் போன்றவை)",
    'ருகூஉ - குனியும் முன் கை உயர்த்துதல் #2. முதுகு பலகைபோல நேராக, கைகள் முழங்காலைப் பற்றி, விரல்கள் விரிந்திருக்க - ஸுப்ஹான ரப்பியல் அழீம் 3 முறை',
    'நிலைக்கு எழுதல் - ஸமிஅல்லாஹு லிமன் ஹமிதஹ் - ரப்பனா வலகல் ஹம்த் - நேராக நிற்கவும் - கை உயர்த்துதல் #3',
    "ஸஜ்தா - 7 உறுப்புகள்: நெற்றி+மூக்கு, 2 உள்ளங்கைகள், 2 முழங்கால்கள், 2 பாதங்களின் விரல்கள் கிப்லாவை நோக்கி - ஸுப்ஹான ரப்பியல் அஃலா 3 முறை",
    'அமர்தல் (ஜல்ஸா) - இரு ஸஜ்தாக்களுக்கு இடையில் அமர்ந்து "ரப்பிஃக்ஃபிர்லீ" கூறவும்',
    'இரண்டாம் ஸஜ்தா - முதலாவது போலவே',
    'அடுத்த ரக்அத்துக்கு எழுதல் - 2ஆம் ரக்அத்திலிருந்து 3ஆம் ரக்அத்துக்கு எழும்போது கை உயர்த்துதல் #4',
    'அத்தஹிய்யாத் - முதல் அமர்வு (2 ரக்அத்துக்குப் பின்): இஃப்திராஷ் (இடக்கால் மேல் அமர்ந்து, வலக்கால் நிமிர்த்தி). கடைசி அமர்வு: தவர்ருக் (இடக்காலை வலக்காலின் கீழ் வெளியே எடுத்து, இடுப்பு தரையில்) - புகாரி 828. ஆட்காட்டி விரலை தொடக்கம் முதல் இறுதி வரை அசைத்து, பார்வையை விரல் மீது வைக்கவும் - முஸ்லிம் (API 1016)',
    'ஸலவாத் (இப்ராஹீமிய்யா) + ஸலாமுக்கு முன் துஆ (நரகம், கப்ர், தஜ்ஜால் ஆகியவற்றிலிருந்து பாதுகாப்பு)',
    'ஸலாம் - அஸ்ஸலாமு அலைக்கும் வரஹ்மதுல்லாஹ், வலப்புறம் பின் இடப்புறம். பின்னர் திக்ருகளை ஓதவும்: துஆக்கள் > தொழுகைக்குப் பின்'
  ].map((s, i) => `<li><div class="n">${i + 1}</div><div class="stepbox">${s}</div></li>`).join('');
  return `<div class="card">
    <h2>5 நேரத் தொழுகை - முழு வழிகாட்டி</h2>
    <p class="mute" style="font-size:13px;max-width:52ch">கைகள் நெஞ்சின் மீது, 4 இடங்களில் கை உயர்த்துதல், வரிசை நேராக. புகாரி, முஸ்லிம் நூல்களிலிருந்து நேரடியாக.</p>
    <div class="grid g6" style="margin-top:12px">${cards}</div>
  </div>
  <div class="card">
    <h3 style="font-size:16px">${sel.name} தொழுகை - படிப்படியாகத் தொழும் முறை</h3>
    <div class="grid gm">
      <div class="card soft" style="margin:0"><h3>எண்ணம் (உள்ளத்தில்)</h3>
        <div style="font-size:12px;margin-top:4px">"${sel.name} ஃபர்ளு ${sel.fard} ரக்அத் அல்லாஹ்வுக்காக கிப்லாவை முன்னோக்கித் தொழுகிறேன்" - என்று உள்ளத்தில் எண்ணினால் போதும்; வாயால் சொல்வது நபிவழியில் இல்லை.</div>
        <div class="mute">ஆதாரம்: புகாரி - செயல்கள் எண்ணங்களைப் பொறுத்தே; எண்ணம் உள்ளத்தில் உள்ளது.</div></div>
      <div class="card dark" style="margin:0"><h3>கை உயர்த்துதல் - 4 இடங்கள் (ஸஹீஹ்)</h3>${checks}
        <div style="font-size:10px;opacity:.7;margin-top:6px">புகாரி 735-739 - இப்னு உமர் (ரலி) எப்போதும் செய்தார்கள்.</div></div>
    </div>
    <ol class="steps">${steps}</ol>
    <div class="card amber" style="margin:14px 0 0"><h3>பொதுவான தவறுகள்</h3><ul>
      <li><b>ஆட்காட்டி விரல் - மோதிர விரல் அல்ல:</b> அத்தஹிய்யாத்தில் ஆட்காட்டி விரலை மட்டும் அசைக்கவும்; மோதிர விரலை அல்ல.</li>
      <li>கைகள் நெஞ்சின் மீது - தொப்புளுக்குக் கீழ் அல்ல.</li>
      <li>வரிசை நேராக - தோளோடு தோள், பாதத்தோடு பாதம்; ஷைத்தானுக்கு இடைவெளி விடாதீர்கள்.</li>
      <li>ருகூஉவில் முதுகு நேராக, முழங்கைகள் விலாவை விட்டு விலகி இருக்க.</li></ul></div>
  </div>
  <div class="grid g2">${DUAS.filter((d) => ['istiftah', 'sana', 'tahiyyat', 'durood', 'fatiha'].includes(d.id)).map(duaCard).join('')}</div>`;
}

function dailyMore() {
  const row = (a) => '<tr>' + a.map((c) => '<td>' + c + '</td>').join('') + '</tr>';
  const tbl = (head, rows) => '<div style="overflow-x:auto"><table class="tbl"><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row).join('') + '</tbody></table></div>';
  const sun = tbl(['தொழுகை', 'முன் (சுன்னத்)', 'பின் (சுன்னத்)', 'மொத்தம் / குறிப்பு'], [
    ['ஃபஜ்ர்', '2 (வலியுறுத்தப்பட்டது)', '-', '2 சுன்னத் + 2 ஃபர்ளு. உலகத்தையும் அதிலுள்ளவற்றையும் விடச் சிறந்தது - முஸ்லிம் 725'],
    ['ளுஹ்ர்', '4 (2+2)', '2', '6 சுன்னத் + 4 ஃபர்ளு'],
    ['அஸ்ர்', 'குறிப்பிட்ட சுன்னத் இல்லை', '-', '-'],
    ['மக்ரிப்', 'குறிப்பிட்டது இல்லை (விரும்பினால் 2)', '2', '2 சுன்னத் + 3 ஃபர்ளு'],
    ['இஷா', 'குறிப்பிட்டது இல்லை (விரும்பினால் அதானுக்கும் இகாமத்துக்கும் இடையில் 2)', '2', '2 சுன்னத் + 4 ஃபர்ளு + வித்ர்']
  ]);
  const bid = tbl(['நடைமுறையில் உள்ளது', 'ஸஹீஹான நபிவழி'], [
    ['நிய்யத்தை வாயால் சொல்வது ("உஸல்லீ ஃபர்ளல்...")', 'நிய்யத் உள்ளத்தில் உள்ளது. வாயால் சொல்வது நபிவழியில் இல்லை - புகாரி 1'],
    ['கைகளைத் தொப்புளுக்குக் கீழ் வைப்பது', 'வலக்கையை இடக்கை மேல் வைப்பது - புகாரி 740'],
    ['பின்பற்றுபவரும் "ஸமிஅல்லாஹு லிமன் ஹமிதஹ்" கூறுவது', 'இமாம் அதைக் கூறுவார்; பின்பற்றுபவர் "ரப்பனா வலகல் ஹம்த்" மட்டும் கூறுவார் - புகாரி 796'],
    ['"இல்லல்லாஹ்" என்பதில் மட்டும் விரலை உயர்த்தித் தாழ்த்துவது', 'அத்தஹிய்யாத்தின் தொடக்கம் முதல் இறுதி வரை விரலால் சுட்டிக்காட்டி துஆவில் அசைக்கவும் - முஸ்லிம் (API 1016)'],
    ['ஃபர்ளு தொழுகைக்குப் பின் இமாம் தலைமையில் கூட்டாகக் கை உயர்த்தி துஆ', 'நபி ﷺ அவர்களிடமிருந்து அறிவிக்கப்படவில்லை; திக்ரும் துஆவும் தனித்தனியாக (துஆக்கள் > தொழுகைக்குப் பின் பார்க்க)'],
    ['பெருநாள் தக்பீர்களுக்கு இடையே கூட்டாகத் திக்ர்', 'தக்பீர்களுக்கு இடையே குறிப்பிட்ட திக்ர் நிரூபணமாகவில்லை'],
    ['ஸலாமுக்குப் பின் கைகளால் முகத்தைத் தடவுவது', 'இதற்கு ஆதாரப்பூர்வ ஹதீஸ் இல்லை (அறிவிப்புகள் பலவீனமானவை)']
  ]);
  return `<div class="card"><h3 style="font-size:16px">வித்ரு & குனூத்</h3>
    <p style="font-size:13px">வித்ரு என்றால் "ஒற்றைப்படை". இது இஷாவுக்குப் பின் ஃபஜ்ருக்கு முன் தொழும், வலியுறுத்தப்பட்ட தொழுகை; 1, 3, 5, 7, 9 அல்லது 11 ரக்அத் - முஸ்லிம் 749.</p>
    <ul><li><b>3 ரக்அத்:</b> 2 ரக்அத் தொழுது ஸலாம் கொடுத்து, பின் 1 ரக்அத் (சிறந்தது); அல்லது தொடர்ச்சியாக 3 ரக்அத், கடைசியில் மட்டும் அமர்தல்.</li>
    <li><b>குனூத்:</b> இந்த ஆப் புகாரி/முஸ்லிம் ஹதீஸ்களை மட்டுமே காட்டுகிறது; வித்ர் குனூத் துஆவுக்கு அவற்றில் தனி ஆதாரம் நமது API-யில் இல்லாததால் இங்கு காட்டப்படவில்லை.</li></ul>
    <div class="mute" lang="ta">வித்ரு என்றால் "ஒற்றைப்படை". இஷாவுக்குப் பின் ஃபஜ்ருக்கு முன் 1, 3, 5, 7, 9 அல்லது 11 ரக்அத்களாகத் தொழலாம். 3 ரக்அத் எனில் 2+1 (ஸலாம் கொடுத்து) தொழுவது சிறந்தது.</div></div>
  <div class="card"><h3 style="font-size:16px">சுன்னத் & நஃபில் - தினமும் 12 ரக்அத் (ரவாதிப்)</h3>
    <p style="font-size:13px">"ஃபர்ளு அல்லாமல் தினமும் 12 ரக்அத் தொழுபவருக்கு சொர்க்கத்தில் ஒரு வீடு கட்டப்படும்" - முஸ்லிம் 728.</p>${sun}
    <ul style="margin-top:10px">
      <li><b>தஹஜ்ஜுத் / கியாமுல் லைல்:</b> இரவின் கடைசி மூன்றில் ஒரு பகுதி; 2+2 என்று தொழுது 1 அல்லது 3 வித்ருடன் முடித்தல், மொத்தம் 11 - புகாரி 1147.</li>
      <li><b>ளுஹா:</b> சூரிய உதயத்துக்கு சுமார் 15-20 நிமிடங்களுக்குப் பின் முதல் ளுஹ்ருக்கு முன் வரை, 2, 4 அல்லது 8 ரக்அத். இது 360 மூட்டுகளுக்கான தர்மம் - முஸ்லிம் 720.</li>
      <li><b>தஹிய்யத்துல் மஸ்ஜித்:</b> பள்ளியில் அமர்வதற்கு முன் 2 ரக்அத் - புகாரி 444.</li>
      <li><b>உளூவுக்குப் பின் 2 ரக்அத்:</b> புகாரி 1149. <b>இஸ்திகாரா:</b> 2 ரக்அத் மற்றும் துஆ - புகாரி 1162, 6382.</li></ul></div>
  <div class="card"><h3 style="font-size:16px">பயணத் தொழுகை - கஸ்ர் & ஜம்உ</h3>
    <p style="font-size:13px">சுருக்கித் தொழுவது அல்லாஹ் அளித்த கொடை; அந்தக் கொடையை ஏற்றுக் கொள்ளுங்கள் - முஸ்லிம் 686.</p>
    <ul><li><b>கஸ்ர்:</b> 4 ரக்அத் தொழுகைகளை (ளுஹ்ர், அஸ்ர், இஷா) 2 ஆகச் சுருக்கவும். ஃபஜ்ர் (2), மக்ரிப் (3) சுருக்கப்படாது. பயணத்தில் ஃபஜ்ரின் 2 சுன்னத்தும் வித்ரும் தவிர மற்ற ரவாதிப் தேவையில்லை - புகாரி 1101, 1102.</li>
    <li><b>ஜம்உ தக்தீம் (முற்படுத்துதல்):</b> ளுஹ்ருடன் அஸ்ரை ளுஹ்ர் நேரத்தில், அல்லது மக்ரிபுடன் இஷாவை மக்ரிப் நேரத்தில் தொழுதல்.</li>
    <li><b>ஜம்உ தஃகீர் (பிற்படுத்துதல்):</b> ளுஹ்ரை அஸ்ர் நேரம் வரை தாமதித்து இரண்டையும் தொழுதல்; அல்லது மக்ரிபை இஷா நேரம் வரை தாமதித்தல் - புகாரி 1111, முஸ்லிம் 704.</li>
    <li>கடும் மழை, நோய் போன்ற சிரமங்களுக்காகப் பயணம் இல்லாமலும் ஜம்உ செய்ய அனுமதி உண்டு - முஸ்லிம் 705 (API 1272).</li></ul>
    <div class="mute" lang="ta">பயணத்தில் ளுஹ்ர், அஸ்ர், இஷாவை 2 ரக்அத்களாகச் சுருக்கித் தொழலாம்; ஃபஜ்ர், மக்ரிப் சுருக்கப்படாது. ளுஹ்ர்-அஸ்ர் அல்லது மக்ரிப்-இஷாவைச் சேர்த்தும் தொழலாம்.</div>
    <div class="mute">எவ்வளவு தூரம் பயணமாகக் கணக்கிடப்படும் என்பதில் அறிஞர்களிடையே கருத்து வேறுபாடு உண்டு; நபி ﷺ அவர்கள் பயணத்தில் சுருக்கித் தொழுதார்கள். தூரம் குறித்து உங்கள் ஊர் அறிஞரிடம் கேளுங்கள்.</div></div>
  <div class="card amber"><h3 style="font-size:16px">தொழுகையில் நடைமுறையில் உள்ள பித்அத்கள் - தவிர்க்கவும்</h3>${bid}
    <div style="font-size:12px;margin-top:8px">அல்லாஹ் கூறுகிறான்: "நிச்சயமாகத் தொழுகை மானக்கேடானவற்றையும் தீயவற்றையும் தடுக்கும்" - குர்ஆன் 29:45.</div></div>`;
}

function viewWudu() {
  const steps = [
    ['எண்ணம் & பிஸ்மில்லாஹ்', 'உள்ளத்தில் எண்ணம் - வாயால் அல்ல. புகாரி 1.', '-'],
    ['கைகளைக் கழுவுதல் 3 முறை', 'மணிக்கட்டு வரை 3 முறை', 'விரல்கள், நகங்கள் - எல்லா இடத்திலும் தண்ணீர் சேர வேண்டும்.'],
    ['வாய் கொப்பளித்தல் 3 + மூக்கில் நீர் 3', 'வாய் கொப்பளிப்பு 3, மூக்கு 3 - இடக்கையால் சிந்தவும்', 'வாயை நன்கு கொப்பளிக்கவும். மூக்கில் மெதுவாக நீர் இழுத்து இடக்கையால் சுத்தம் செய்யவும். புகாரி 159'],
    ['முகம் 3 முறை', 'முகம் 3 முறை - காது முதல் காது வரை, நெற்றி முதல் தாடை வரை', 'அடர்ந்த தாடியா? ஈரவிரல்களால் கோதிவிடவும்.'],
    ['முழங்கை வரை கைகள் 3 முறை', 'வலக்கை முழங்கை வரை 3, பின் இடக்கை', 'வலப்புறத்தில் தொடங்கவும். முழங்கையும் சேர்த்து.'],
    ['தலையை மஸ்ஹு 1 முறை + காதுகள்', 'தலை மஸ்ஹு ஒரு முறை - காதின் உள்ளும் வெளியும்', 'இரு கைகளையும் முன்னிருந்து பின்னாகவும் பின் முன்னாகவும் தடவி, பின் ஆட்காட்டி விரல் + பெருவிரலால் காதுகளைத் தடவவும். புகாரி 185'],
    ['கணுக்கால் வரை பாதங்கள் 3 முறை', 'வலக்கால் கணுக்கால் வரை 3, பின் இடக்கால்', 'சுண்டு விரலால் கால் விரல்களுக்கு இடையே கழுவவும். வலக்காலை முதலில். புகாரி 186'],
    ['உளூவுக்குப் பின் துஆ', 'அஷ்ஹது அன் லா இலாஹ இல்லல்லாஹ்... (துஆக்கள் பிரிவில் காண்க)', 'சொர்க்கத்தின் 8 வாசல்கள் திறக்கப்படும் - முஸ்லிம் 234 (API 397)']
  ].map((s, i) => `<li><div class="n">${i + 1}</div><div class="stepbox s"><b style="color:var(--gt)">${s[0]}</b> <span style="color:var(--mute)">• ${s[1]}</span><div style="font-size:12px;margin-top:3px;color:var(--ink2)">${s[2]}</div></div></li>`).join('');
  return `<div class="card"><h2>உளூ - முழுமையான 8 படிகள்</h2>
    <p class="mute">பிஸ்மில்லாஹ் கூறித் தொடங்குங்கள். எண்ணம் உள்ளத்தில் - வாயால் சொல்ல வேண்டாம்.</p>
    <ol class="steps">${steps}</ol>
    <div class="grid g2">
      <div class="card dark" style="margin:0"><h3>உளூவை முறிப்பவை</h3><ul>
        <li>இயற்கை உபாதைகள்: சிறுநீர், மலம், காற்று (புகாரி 135)</li><li>படுத்து ஆழ்ந்து உறங்குதல்; லேசான தூக்கக் கண்ணயர்வு அல்ல</li>
        <li>தடையின்றி இச்சையுடன் மர்மஸ்தானத்தைத் தொடுதல் (அஹ்மத்)</li>
        <li>ஒட்டக இறைச்சி உண்ணுதல் (முஸ்லிம் 360 (API 588))</li><li>சுயநினைவு இழத்தல், மயக்கம், பைத்தியம்</li></ul></div>
      <div class="card" style="margin:0"><h3>பொதுவான தவறு - மோதிரம் & கடிகாரம்</h3>
        <div style="font-size:12px;margin-top:6px">உளூவில் மோதிரம் / கடிகாரம் / வளையல் அடியில் தண்ணீர் சேராமல் போகலாம் - தோலில் தண்ணீர் சேர அவற்றை நகர்த்தவும் அல்லது கழற்றவும். தனிக் குறிப்பு: அத்தஹிய்யாத்தில் அசைக்க வேண்டியது <b>ஆட்காட்டி விரல்</b>; மோதிர விரல் அல்ல. தங்க மோதிரம் ஆண்களுக்கு ஹராம்.</div></div>
    </div></div>`;
}

function viewJumma() {
  return `<div class="card"><h2>ஜும்ஆ தொழுகை - வெள்ளிக்கிழமை - முழு நபிவழி</h2>
    <p class="mute">வெள்ளிக்கிழமை - சிறந்த நாள். சூரா கஹ்ஃப் ஓதவும், அதிகம் ஸலவாத் கூறவும். சீக்கிரமாகச் செல்லவும்.</p>
    <div class="grid g2">
      <div class="card soft" style="margin:0"><h3>ஜும்ஆவுக்கு முன் - குளிப்பு</h3><ul>
        <li>வெள்ளிக்கிழமை முழுக் குளிப்பு - புகாரி 877</li><li>சுத்தமான ஆடை, மணம் (ஆல்கஹால் அற்றது), மிஸ்வாக், நகம் வெட்டுதல்</li>
        <li>சீக்கிரம் செல்வது: 1ஆம் நேரம் = ஒட்டகம், 2ஆம் = மாடு, 3ஆம் = ஆடு, 4ஆம் = கோழி, 5ஆம் = முட்டை (தர்மம் செய்த நன்மை) - புகாரி 881</li>
        <li>முன்னால் செல்ல மக்களின் கழுத்துகளைத் தாண்டிச் செல்ல வேண்டாம்</li>
        <li>உள்ளே நுழைந்ததும் 2 ரக்அத் தஹிய்யத்துல் மஸ்ஜித் - குத்பா நடந்தாலும் - முஸ்லிம் 875 (API 1589)</li></ul></div>
      <div class="card dark" style="margin:0"><h3>குத்பா ஒழுங்குகள்</h3><ul>
        <li>அமைதியாகக் கேளுங்கள் - பேச்சு, போன், விரிப்பில் விளையாடுதல் கூடாது - புகாரி 934</li>
        <li>குத்பாவின்போது "அமைதியாக இரு" என்று சொல்வதும் வீணான செயலே</li>
        <li>இமாம் இடையில் அமர்ந்து 2 குத்பாக்கள் நிகழ்த்துவார் - குர்ஆன், ஹதீஸ் மட்டுமே</li>
        <li>2 குத்பாக்களுக்கு இடையில் உள்ளத்தில் அமைதியாகத் துஆ செய்யுங்கள்</li></ul></div>
    </div>
    <div class="card" style="margin:14px 0 0"><h3>ஜும்ஆ தொழும் முறை</h3><ul style="list-style:none;padding:0">
      <li><b>1.</b> குத்பா - முழுவதும் கேளுங்கள். தஹிய்யத்துல் மஸ்ஜிதைத் தவிர குத்பாவின்போது வேறு சுன்னத் இல்லை.</li>
      <li><b>2.</b> இகாமத் - இமாம் 2 ரக்அத் ஃபர்ளு சப்தமாகத் தொழுவார் - முதலில் ஃபாத்திஹா + சூரா அல்அஃலா, இரண்டாவதில் அல்காஷியா - முஸ்லிம் 878</li>
      <li><b>3.</b> ஸலாமுக்குப் பின் சுன்னத்: பள்ளியில் தொழுதால் 4 ரக்அத் (2+2) - முஸ்லிம் 881; வீட்டில் தொழுதால் 2 ரக்அத் - புகாரி 937, முஸ்லிம் 882.</li>
      <li><b>4.</b> தாமதமானால்: இமாமுடன் ஒரு ரக்அத் கிடைத்தால் ஜும்ஆ கிடைத்தது. ஒன்றும் கிடைக்கவில்லை எனில் 4 ரக்அத் ளுஹ்ர் தொழவும் - புகாரி 580</li>
      <li><b>5.</b> இமாம் மிம்பரில் அமரும்போது ஒரே அதான் தான் அசல் நபிவழி. 2ஆம் அதான் உஸ்மான் (ரலி) காலத்தில் கடைவீதி மக்களுக்காகச் சேர்க்கப்பட்டது.</li></ul></div>
    <div class="card amber" style="margin:14px 0 0;font-size:12px"><b>பொதுவான தவறு:</b> குத்பாவின்போது பேசுவது, சப்தமாகத் தஸ்பீஹ் செய்வது, சப்தமாக ஆமீன் கூறுவது. மேலும் ஜும்ஆ ஃபர்ளுக்கு முன் பொதுவான நஃபிலைத் தவிர குறிப்பிட்ட சுன்னத் இல்லை.</div></div>`;
}

function viewEid() {
  const li = (n, h) => `<li><div class="n">${n}</div><div style="font-size:13px">${h}</div></li>`;
  return `<div class="card"><h2>ஈதுல் ஃபித்ர் & ஈதுல் அள்ஹா - பெருநாள் தொழுகை</h2>
    <div style="margin-top:6px"><span class="tag">அதான், இகாமத் இல்லை</span><span class="tag">குத்பா தொழுகைக்குப் பின்</span><span class="tag">7+5 தக்பீர்கள்</span></div>
    <div class="grid g2">
      <div class="card soft" style="margin:0"><h3>ஃபித்ரு ஸகாத் - பெருநாள் தொழுகைக்கு முன், கட்டாயம்</h3><ul>
        <li>ஒருவருக்கு 1 ஸாஃ (சுமார் 2.5 முதல் 3 கிலோ) அரிசி/கோதுமை/பேரீச்சம்பழம் - குடும்பத்தின் ஒவ்வொருவருக்கும், பெருநாளுக்கு முன் பிறந்த குழந்தை உட்பட</li>
        <li>ஏழைகளுக்கும் தேவையுடையவர்களுக்கும் கொடுக்கவும் - பள்ளி கட்டுவதற்கு அல்ல</li>
        <li>நேரம்: பெருநாளுக்கு 1-2 நாட்கள் முன் முதல் பெருநாள் தொழுகைக்கு முன் வரை. தொழுகைக்குப் பின் சாதாரண தர்மமே - புகாரி 1503</li>
        <li>உணவுப் பொருளாகக் கொடுப்பதே வலுவான அறிவிப்பு; தேவை இருப்பின் அதன் மதிப்புத் தொகையை சில அறிஞர்கள் அனுமதிக்கின்றனர்</li>
        <li>ஞானம்: ஏழைகளும் பெருநாளைக் கொண்டாடுவர்; நோன்பில் ஏற்பட்ட குறைகளையும் இது சுத்தப்படுத்தும்</li></ul></div>
      <div class="card dark" style="margin:0"><h3>பெருநாள் தின நபிவழிகள்</h3><ul>
        <li>குளிப்பு, சிறந்த ஆடை (புதியதாக இருக்க வேண்டியதில்லை), மணம்</li>
        <li>ஈதுல் ஃபித்ர்: செல்லும் முன் ஒற்றைப்படை பேரீச்சம்பழம் உண்ணவும். ஈதுல் அள்ஹா: குர்பானிக்குப் பின் உண்ணவும்.</li>
        <li>இரவு முதல் இமாம் தொடங்கும் வரை தக்பீர்: அல்லாஹு அக்பர், அல்லாஹு அக்பர், லா இலாஹ இல்லல்லாஹ், அல்லாஹு அக்பர், அல்லாஹு அக்பர் வ லில்லாஹில் ஹம்த்</li>
        <li>ஒரு வழியாகச் சென்று வேறு வழியாகத் திரும்பவும் - புகாரி 986</li>
        <li>பெண்களும் குழந்தைகளும் செல்லலாம்; மாதவிடாய் உள்ள பெண்கள் தொழும் இடத்திலிருந்து விலகி அமரவும் - புகாரி 324</li></ul></div>
    </div>
    <div class="card bord" style="margin:14px 0 0"><h3 style="font-size:14px">பெருநாள் தொழும் முறை - 7 & 5 தக்பீர்கள்</h3>
      
      <ol class="steps">
        ${li(1, '<b>எண்ணம்:</b> உள்ளத்தில் - "அல்லாஹ்வுக்காக பெருநாள் 2 ரக்அத்" - வாயால் சொல்லும் வாசகம் இல்லை.')}
        ${li(2, '<b>முதல் ரக்அத்:</b> தக்பீரத்துல் இஹ்ராம் + <b>7 கூடுதல் தக்பீர்கள்</b>, ஒவ்வொரு முறையும் கை உயர்த்தவும். இடையில் மௌனம் அல்லது ஸுப்ஹானல்லாஹ். பின் ஃபாத்திஹா + <b>சூரா அல்அஃலா</b>. பின் வழக்கம்போல ருகூஉ, ஸஜ்தா.')}
        ${li(3, '<b>இரண்டாம் ரக்அத்:</b> எழும் தக்பீர் + <b>5 கூடுதல் தக்பீர்கள்</b>. பின் ஃபாத்திஹா + <b>சூரா அல்காஷியா</b> - முஸ்லிம் 878. தொழுகையை முடிக்கவும்.')}
        ${li(4, '<b>ஸலாமுக்குப் பின் குத்பா:</b> இமாம் குத்பா நிகழ்த்துவார். இருந்து கேட்பது சிறந்தது.')}
        ${li(5, '<b>பின்னர்:</b> "தகப்பலல்லாஹு மின்னா வ மின்கும்" என்று வாழ்த்தவும். உறவினர்களைச் சந்திக்கவும். இசை கூடாது.')}
      </ol>
      <div class="grid g2"><div class="card soft" style="margin:0;font-size:11px"><b>முதல் ரக்அத்:</b> 1 இஹ்ராம் + ஃபாத்திஹாவுக்கு முன் 7 கூடுதல் தக்பீர்கள்</div><div class="card soft" style="margin:0;font-size:11px"><b>இரண்டாம் ரக்அத்:</b> 1 எழுதல் + ஃபாத்திஹாவுக்கு முன் 5 கூடுதல் தக்பீர்கள்</div></div>
    </div>
    <div class="card amber" style="margin:14px 0 0;font-size:12px"><b>குறிப்பு:</b> ஈதுகாஹ்வில் பெருநாள் தொழுகைக்கு முன்னும் பின்னும் சுன்னத் தொழுகை இல்லை. பெருநாள் தொழுகை திடலில் (ஈதுகாஹ்) தொழப்படும் - புகாரி 956. மழை பெய்தால் பள்ளியில் தொழலாம்.</div></div>`;
}

function viewAqeedah() {
  const items = [
    ['1. படைப்பிலும் அதிகாரத்திலும் ஏகத்துவம் (ருபூபிய்யா)', 'அல்லாஹ் ஒருவனே அனைத்தையும் படைத்து, பராமரித்து, நிர்வகிக்கிறான். குர்ஆன் 39:62', 'உணவு வாழ்வாதாரத்தை அல்லாஹ்விடம் மட்டுமே கேளுங்கள் - தர்காவில் அல்ல.'],
    ['2. வணக்க வழிபாட்டில் ஏகத்துவம் (உலூஹிய்யா)', 'எல்லா வணக்கங்களும் அல்லாஹ்வுக்கே - தொழுகை, துஆ, நேர்ச்சை, அச்சம். குர்ஆன் 1:5 - இய்யாக நஃபுது', 'துஆ ஒரு வணக்கம். மண்ணறையில் உள்ளவர்களிடம் துஆ செய்வது ஷிர்க்.'],
    ['3. திருநாமங்கள் & பண்புகளில் ஏகத்துவம் (அஸ்மா வ ஸிஃபாத்)', 'அல்லாஹ்வின் பெயர்களையும் பண்புகளையும் அவன் கூறியபடியே, திரிக்காமல் ஏற்பது. குர்ஆன் 42:11', 'அல்லாஹ்வின் அறிவு எங்கும் உள்ளது; அல்லாஹ் அர்ஷுக்கு மேல் உயர்ந்துள்ளான்.']
  ].map((e) => `<div class="card soft" style="margin:0"><h3>${e[0]}</h3><div style="font-size:13px;margin-top:6px">${e[1]}</div><div style="font-size:12px;margin-top:6px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px">${e[2]}</div></div>`).join('');
  return `<div class="card"><h2>தவ்ஹீத் என்றால் என்ன? - அகீதா சுருக்கம்</h2>
    <p class="mute">எளிமையாக - தத்துவம் இல்லை, குர்ஆனும் ஹதீஸும் மட்டுமே.</p><div class="grid g3">${items}</div>
    <div class="card amber" style="margin:14px 0 0"><h3>தர்கா, மவ்லிது, கத்தம், இறந்தவர்களுக்கான ஃபாத்திஹா ஆகியவற்றை நாம் ஏன் மறுக்கிறோம்</h3><ul>
      <li><b>குர்ஆன் 35:22</b> - மண்ணறையில் இருப்பவர்களை உங்களால் செவியுறச் செய்ய முடியாது.</li>
      <li><b>புகாரி 1330</b> - மண்ணறைகள் மீது கட்டடம் எழுப்பவும் விளக்கேற்றவும் நபி ﷺ அவர்கள் தடுத்தார்கள்.</li>
      <li><b>மவ்லிது</b> - ஸஹாபாக்கள் ஒருபோதும் கொண்டாடவில்லை. ஒவ்வொரு பித்அத்தும் வழிகேடு (முஸ்லிம் 867).</li>
      <li><b>நபி ﷺ அவர்களை நேசிப்பது</b> அவர்களின் வழிமுறையைப் பின்பற்றுவதன் மூலமே; விழாக்களால் அல்ல.</li></ul></div></div>`;
}

const DUA_LABEL = { all: 'அனைத்தும்', after: 'தொழுகைக்குப் பின்', daily: 'தொழுகையில்', azkar: 'திக்ருகள்', witr: 'வித்ர்' };

function viewDuas() {
  if (duaOpen === '#adhkar') return backBar('duaback') + adhkarPage();
  if (duaOpen === '#tasbih') return backBar('duaback') + tasbihPage();
  if (duaOpen) {
    const d = DUAS.find((x) => x.id === duaOpen);
    if (d) return backBar('duaback') + duaCard(d);
    duaOpen = null;
  }
  const f = ['after', 'all', 'daily', 'azkar', 'witr'].map((c) => `<button class="${duaFilter === c ? 'on' : ''}" data-act="filter" data-key="${c}">${DUA_LABEL[c]}</button>`).join('');
  const note = duaFilter === 'after' ? `<div class="card" style="margin:0 0 10px"><h3>ஸலாமுக்குப் பின்</h3>
    <ul><li>இவற்றை ஒவ்வொருவரும் தனித்தனியாக அமைதியாக ஓதவும். கடமையான தொழுகைக்குப் பின் கூட்டாகக் கை உயர்த்தி துஆ செய்ய நபி ﷺ அவர்கள் தலைமை தாங்கவில்லை.</li>
    <li lang="ta">தொழுகைக்குப் பின் இந்த துஆக்களையும் திக்ருகளையும் ஒவ்வொருவரும் தனித்தனியாக ஓதவேண்டும். இமாம் தலைமையில் கூட்டாகக் கை உயர்த்தி துஆ செய்வது நபிவழியில் இல்லை.</li></ul></div>` : '';
  const rows = DUAS.filter((d) => duaFilter === 'all' || d.cat === duaFilter).map((d) => lrow('duaopen', d.id, '🤲', d.title, (DUA_LABEL[d.cat] || d.cat) + ' • ' + d.ref)).join('');
  return backBar('tosvc') + `<div class="card"><h2 style="font-size:18px">துஆக்கள் - நகலெடு • கேள் • ஆஃப்லைன்</h2><div class="filters">${f}</div>
    <p class="mute">${tx('Tap a dua to open it: Arabic, pronunciation, meaning, copy and listen.', 'ஒரு துஆவைத் தொட்டுத் திறக்கவும்: அரபி, உச்சரிப்பு, பொருள், நகலெடு, கேள்.')}</p></div>
    <div class="card list">${lrow('duaopen', '#adhkar', '🌅', tx('Morning, evening & night adhkar', 'காலை, மாலை, இரவு அதுகார்'), tx('Counts each line - ' + AK_LABEL[akDueSet()][0] + ' is due now', 'ஒவ்வொரு வரியையும் எண்ணலாம் - இப்போது: ' + AK_LABEL[akDueSet()][1]))}
    ${lrow('duaopen', '#tasbih', '📿', tx('Tasbih counter', 'தஸ்பீஹ் எண்ணி'), tx('33 / 34 / 100, with vibration', '33 / 34 / 100, அதிர்வுடன்'))}</div>
    ${note}<div class="card list">${rows}</div>`;
}

function viewSpecial() {
  const d = DUAS.find((x) => x.id === 'istikhara');
  return `<div class="card"><h2>சிறப்புத் தொழுகைகள் - ஜனாஸா, இஸ்திகாரா, தராவீஹ்</h2>
    <div class="grid g3">
      <div class="card dark" style="margin:0"><h3>ஜனாஸா - 4 தக்பீர்கள்</h3><ol>
        <li>தக்பீர்: ஃபாத்திஹா</li><li>ஸலவாத் இப்ராஹீமிய்யா</li><li>இறந்தவருக்கான துஆ - அல்லாஹும்மஃக்ஃபிர் லஹு வர்ஹம்ஹு...</li><li>ஸலாம். ருகூஉ, ஸஜ்தா இல்லை</li></ol>
        <div style="font-size:11px;opacity:.7;margin-top:6px">புகாரி 1335</div></div>
      <div class="card soft" style="margin:0"><h3>இஸ்திகாரா - 2 ரக்அத்</h3>
        <div style="font-size:12px;margin-top:6px">ஒரு முடிவெடுக்க: 2 ரக்அத் நஃபில் தொழுது பின் துஆ ஓதவும் (துஆக்கள் பிரிவில் காண்க). கனவு தேவையில்லை - உள்ளத்தில் நிம்மதியும் வழி திறப்பதும் கவனிக்கவும். புகாரி 1162, 6382</div></div>
      <div class="card bord" style="margin:0"><h3>தராவீஹ் - 8 ரக்அத்</h3>
        <div style="font-size:12px;margin-top:6px">நபி ﷺ அவர்கள் 8 + 3 வித்ர் = 11 தொழுதார்கள் (புகாரி 1147 - ஆயிஷா ரலி). உமர் (ரலி) அவர்கள் உபை பின் கஅப், தமீம் அத்தாரீ ஆகியோரை 11 ரக்அத் மக்களுக்குத் தொழுவிக்க உத்தரவிட்டார்கள் (முவத்தா மாலிக், ரமளான் தொழுகை பாடம்). 8 தான் நபிவழி.</div>
        <div style="font-size:11px;margin-top:6px">2+2+2+2 என்று நிதானமாக நீண்ட கியாமுடன் தொழவும்.</div></div>
    </div>
    <div style="margin-top:14px">${duaCard(d)}</div></div>`;
}

function subBar(key, cur, items) {
  return '<div class="card" style="padding:10px"><div class="filters" style="margin:0">' + items.map(([v, l]) => `<button class="${cur === v ? 'on' : ''}" data-act="sub" data-key="${key}" data-v="${v}">${l}</button>`).join('') + '</div></div>';
}
/* ---------------- PRAYER TRACKER ---------------- */
const FARD = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
let TR = load('thw_track', {});
function trSave() {
  try {
    const keep = Date.now() - 200 * 86400000;
    Object.keys(TR).forEach((k) => { const p = k.split('-'); if (new Date(+p[0], +p[1] - 1, +p[2]).getTime() < keep) delete TR[k]; });
    localStorage.setItem('thw_track', JSON.stringify(TR));
  } catch (e) {}
}
function trCount(dk) { const o = TR[dk] || {}; return FARD.filter((k) => o[k]).length; }
function trStreak() {
  let n = 0; const d = new Date();
  if (trCount(dayKey(d)) < 5) d.setDate(d.getDate() - 1);
  while (trCount(dayKey(d)) === 5) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function trSummary(now) {
  const n = trCount(dayKey(now)), st = trStreak();
  return `<p class="mute">${tx('Prayed today', 'இன்று தொழுதவை')}: <b>${n}/5</b>${st ? ' • 🔥 ' + st + tx(' day streak', ' நாள் தொடர்') : ''} • <a href="#" data-act="trlog">${tx('Prayer log', 'தொழுகைப் பதிவு')}</a></p>`;
}
function trackPage() {
  const rows = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() - i); const dk = dayKey(d);
    const lab = i === 0 ? tx('Today', 'இன்று') : i === 1 ? tx('Yesterday', 'நேற்று') : d.toLocaleDateString(S.lang === 'en' ? 'en-IN' : 'ta-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    rows.push(`<tr><td style="font-size:13px">${lab}</td>${FARD.map((k) => `<td class="r" style="width:auto"><button class="trk ${(TR[dk] || {})[k] ? 'on' : ''}" data-act="trk" data-k="${k}" data-d="${dk}" aria-label="${KEY_LABEL[k]}">✓</button></td>`).join('')}<td class="r" style="width:auto"><b>${trCount(dk)}/5</b></td></tr>`);
  }
  let week = 0; for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); week += trCount(dayKey(d)); }
  return `<div class="card"><h3>📊 ${tx('Prayer log', 'தொழுகைப் பதிவு')}</h3>
    <p class="mute">${tx('Streak', 'தொடர்')}: <b>${trStreak()}</b> ${tx('days', 'நாள்')} • ${tx('Last 7 days', 'கடந்த 7 நாட்கள்')}: <b>${week}/35</b></p>
    <div style="overflow-x:auto"><table class="tbl"><thead><tr><th></th>${FARD.map((k) => `<th style="text-align:center;padding:8px 2px">${KEY_LABEL[k].slice(0, 4)}</th>`).join('')}<th></th></tr></thead><tbody>${rows.join('')}</tbody></table></div>
    <p class="mute">${tx('Only for you - it stays on this phone. Tap to mark a prayer.', 'உங்களுக்காக மட்டுமே; இந்த போனிலேயே இருக்கும். தொழுததைக் குறிக்கத் தொடவும்.')}</p></div>`;
}

/* ---------------- ADHKAR (morning / evening / sleep) + TASBIH ---------------- */
const ADH_IKH = 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ';
const ADH_FAL = 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ';
const ADH_NAS = 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ';
const TA_IKH = 'கூறுவீராக: அவன் அல்லாஹ், ஒருவன். அல்லாஹ் எவரிடமும் தேவையற்றவன். அவன் பெறவுமில்லை, பெறப்படவுமில்லை. அவனுக்கு நிகராக எவரும் இல்லை.';
const TA_FAL = 'கூறுவீராக: அதிகாலையின் இறைவனிடம் பாதுகாவல் தேடுகிறேன் - அவன் படைத்தவற்றின் தீங்கிலிருந்தும், இருள் சூழும்போது இரவின் தீங்கிலிருந்தும், முடிச்சுகளில் ஊதுவோரின் தீங்கிலிருந்தும், பொறாமை கொள்ளும்போது பொறாமைக்காரனின் தீங்கிலிருந்தும்.';
const TA_NAS = 'கூறுவீராக: மனிதர்களின் இறைவன், மனிதர்களின் அரசன், மனிதர்களின் கடவுளிடம் பாதுகாவல் தேடுகிறேன் - மறைந்திருந்து தீய எண்ணங்களைத் தூண்டுபவனின் தீங்கிலிருந்து; அவன் மனிதர்களின் உள்ளங்களில் ஊசலாட்டத்தை ஏற்படுத்துகிறான்; ஜின்களிலிருந்தும் மனிதர்களிலிருந்தும்.';
const ADHKAR = {
  m: [
    { id: 'asb', n: 1, ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', tr: "Asbahnaa wa asbahal-mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'alaa kulli shay'in qadeer.", ta: 'நாங்கள் காலையை அடைந்தோம்; ஆட்சியும் அல்லாஹ்வுக்கே காலையை அடைந்தது. எல்லாப் புகழும் அல்லாஹ்வுக்கே. அல்லாஹ்வைத் தவிர வணக்கத்துக்குரியவன் இல்லை; அவன் தனித்தவன், அவனுக்கு இணை இல்லை. ஆட்சி அவனுக்கே, புகழும் அவனுக்கே; அவன் அனைத்தின் மீதும் ஆற்றல் உள்ளவன்.', ref: 'Muslim 2723' },
    { id: 'sey', n: 1, ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', tr: "Allaahumma anta rabbee laa ilaaha illaa ant, khalaqtanee wa anaa 'abduk, wa anaa 'alaa 'ahdika wa wa'dika mastata't, a'oodhu bika min sharri maa sana't, aboo'u laka bini'matika 'alayya, wa aboo'u laka bidhanbee faghfir lee, fa innahu laa yaghfirudh-dhunooba illaa ant.", ta: 'இறைவா! நீயே என் இறைவன்; உன்னைத் தவிர வணக்கத்துக்குரியவன் இல்லை. நீ என்னைப் படைத்தாய்; நான் உன் அடிமை. என்னால் இயன்றவரை உன் உடன்படிக்கையிலும் வாக்குறுதியிலும் இருக்கிறேன். நான் செய்தவற்றின் தீங்கிலிருந்து உன்னிடம் பாதுகாவல் தேடுகிறேன். நீ எனக்களித்த அருளை ஒப்புக்கொள்கிறேன்; என் பாவத்தையும் ஒப்புக்கொள்கிறேன்; என்னை மன்னித்துவிடு. உன்னைத் தவிர பாவங்களை மன்னிப்பவன் இல்லை. (ஸய்யிதுல் இஸ்திக்ஃபார்)', ref: 'Bukhari 6306' },
    { id: 'tas', n: 100, ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', tr: 'Subhaanallaahi wa bihamdih.', ta: 'அல்லாஹ் தூய்மையானவன்; அவனுக்கே புகழ்.', ref: 'Muslim 2692 (API 5222)' },
    { id: 'tah', n: 10, ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', tr: "Laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'alaa kulli shay'in qadeer.", ta: 'அல்லாஹ்வைத் தவிர வணக்கத்துக்குரியவன் இல்லை; அவன் தனித்தவன், இணை இல்லாதவன். ஆட்சி அவனுக்கே, புகழும் அவனுக்கே; அவன் அனைத்தின் மீதும் ஆற்றல் உள்ளவன்.', ref: 'Bukhari 6404, Muslim 2693 (API 5221)' }
  ],
  s: [
    { id: 'kur', n: 1, ar: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ', tr: 'Ayatul Kursi (Al-Baqarah 2:255)', ta: 'அல்லாஹ் - அவனைத் தவிர வணக்கத்துக்குரியவன் இல்லை; என்றென்றும் உயிருடன் இருப்பவன், அனைத்தையும் நிர்வகிப்பவன். சிறு தூக்கமோ உறக்கமோ அவனைப் பிடிக்காது. வானங்களிலும் பூமியிலும் உள்ளவை அவனுக்கே உரியன. அவன் அனுமதியின்றி அவனிடம் பரிந்துரை செய்பவர் யார்? அவர்களுக்கு முன்னுள்ளதையும் பின்னுள்ளதையும் அவன் அறிவான். அவன் நாடியதைத் தவிர அவனது அறிவில் எதையும் அவர்கள் சூழ்ந்தறிய முடியாது. அவனது அரியணை வானங்களையும் பூமியையும் உள்ளடக்கியது. அவற்றைக் காப்பது அவனுக்குச் சிரமமில்லை. அவன் உயர்ந்தவன், மகத்தானவன்.', ref: 'Bukhari 2311' },
    { id: 'mu3', n: 3, ar: ADH_IKH + '\n' + ADH_FAL + '\n' + ADH_NAS, tr: 'Ikhlaas, Falaq, Naas - blow into both palms and wipe the body (head, face, front), 3 times', ta: 'இக்லாஸ், ஃபலக், நாஸ் சூராக்களை ஓதி, இரு கைகளிலும் ஊதி, தலை, முகம், உடலின் முன்புறம் தடவவும் - 3 முறை.', ref: 'Bukhari 5017' },
    { id: 'tsa', n: 33, ar: 'سُبْحَانَ اللَّهِ', tr: 'Subhaanallaah', ta: 'அல்லாஹ் தூய்மையானவன்', ref: 'Bukhari 3705, Muslim 2728 (API 5273)' },
    { id: 'tha', n: 33, ar: 'الْحَمْدُ لِلَّهِ', tr: 'Alhamdulillaah', ta: 'எல்லாப் புகழும் அல்லாஹ்வுக்கே', ref: 'Bukhari 3705, Muslim 2728 (API 5273)' },
    { id: 'tak', n: 34, ar: 'اللَّهُ أَكْبَرُ', tr: 'Allaahu Akbar', ta: 'அல்லாஹ் மிகப் பெரியவன்', ref: 'Bukhari 3705, Muslim 2728 (API 5273)' },
    { id: 'asl', n: 1, ar: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ', tr: "Allaahumma aslamtu nafsee ilayk, wa fawwadtu amree ilayk, wa alja'tu zahree ilayk, raghbatan wa rahbatan ilayk, laa malja'a wa laa manjaa minka illaa ilayk, aamantu bikitaabikal-ladhee anzalt, wa binabiyyikal-ladhee arsalt.", ta: 'இறைவா! என்னை உன்னிடம் ஒப்படைத்தேன்; என் காரியத்தை உன்னிடம் ஒப்படைத்தேன்; என் முதுகை உன்னிடம் சாய்த்தேன் - ஆசையுடனும் அச்சத்துடனும். உன்னிடமிருந்து தப்பிக்கவோ ஒதுங்கவோ உன்னைத் தவிர வேறு இடம் இல்லை. நீ இறக்கிய வேதத்தையும் நீ அனுப்பிய நபியையும் நம்பினேன்.', ref: 'Bukhari 247' },
    { id: 'bsm', n: 1, ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', tr: "Bismika Allaahumma amootu wa ahyaa.", ta: 'இறைவா! உன் பெயராலேயே இறக்கிறேன், உன் பெயராலேயே உயிர் பெறுகிறேன்.', ref: 'Bukhari 6324' },
    { id: 'wak', n: 1, ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', tr: "Alhamdu lillaahil-ladhee ahyaanaa ba'da maa amaatanaa wa ilayhin-nushoor.", ta: '(எழுந்ததும்) எங்களை இறக்கச் செய்த பின் உயிர்ப்பித்த அல்லாஹ்வுக்கே புகழ்; அவனிடமே எழுப்பப்படுதல்.', ref: 'Bukhari 6312' }
  ]
};
ADHKAR.e = ADHKAR.m.map((d) => {
  if (d.id === 'asb') return Object.assign({}, d, { id: 'ams', ar: d.ar.replace('أَصْبَحْنَا وَأَصْبَحَ', 'أَمْسَيْنَا وَأَمْسَى'), tr: d.tr.replace('Asbahnaa wa asbahal', 'Amsaynaa wa amsal'), ta: d.ta.replace('காலையை அடைந்தோம்; ஆட்சியும் அல்லாஹ்வுக்கே காலையை அடைந்தது.', 'மாலையை அடைந்தோம்; ஆட்சியும் அல்லாஹ்வுக்கே மாலையை அடைந்தது.') });
  if (d.id === 'bik') return Object.assign({}, d, { ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', tr: "Allaahumma bika amsaynaa, wa bika asbahnaa, wa bika nahyaa, wa bika namootu, wa ilaykal-maseer.", ta: 'இறைவா! உன் அருளால் மாலையை அடைந்தோம், உன் அருளால் காலையை அடைந்தோம்; உன்னாலேயே வாழ்கிறோம், உன்னாலேயே மரணிக்கிறோம்; உன்னிடமே மீளுதல்.' });
  return d;
});
const AK_LABEL = { m: ['Morning', 'காலை'], e: ['Evening', 'மாலை'], s: ['Night', 'இரவு'] };
let AK = load('thw_adhkar', { d: '', c: {} }), TS = load('thw_tasbih', { n: 0, t: 33 });
let akSet = null;
function akSave() { try { localStorage.setItem('thw_adhkar', JSON.stringify(AK)); } catch (e) {} }
function tsSave() { try { localStorage.setItem('thw_tasbih', JSON.stringify(TS)); } catch (e) {} }
function akCheckDay() { const d = dayKey(new Date()); if (AK.d !== d) { AK = { d, c: {} }; akSave(); } }
function buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
/* Which set is due now: after Fajr until Dhuhr = morning, after Asr until Isha = evening, otherwise night. */
function akDueSet(now) {
  const t = timesFor(now || new Date()); now = now || new Date();
  if (t.Fajr && t.Dhuhr && now >= t.Fajr && now < t.Dhuhr) return 'm';
  if (t.Asr && t.Maghrib && now >= t.Asr && now < t.Maghrib + 3600000) return 'e';
  if (t.Isha && now >= t.Isha) return 's';
  return t.Asr && now >= t.Dhuhr && now < t.Asr ? 'e' : 's';
}
function adhkarPage() {
  akCheckDay();
  const cur = akSet || akDueSet();
  const seg = '<div class="seg">' + ['m', 'e', 's'].map((k) => `<button class="${cur === k ? 'on' : ''}" data-act="akset" data-v="${k}">${tx(AK_LABEL[k][0], AK_LABEL[k][1])}</button>`).join('') + '</div>';
  const rows = ADHKAR[cur].map((d) => {
    const c = AK.c[cur + ':' + d.id] || 0, done = c >= d.n;
    return `<button class="lrow wr ak ${done ? 'done' : ''}" data-act="akinc" data-id="${d.id}" data-set="${cur}"><span class="li">${done ? '✓' : ''}</span><span class="lt"><span class="ar" lang="ar" dir="rtl">${d.ar.replace(/\n/g, '<br>')}</span><small>${d.tr}</small><small lang="ta">${d.ta}</small><small class="nn">${d.ref}</small></span><span class="cnt">${c}/${d.n}</span></button>`;
  }).join('');
  return `<div class="card"><h3>🌅 ${tx('Morning, evening & night adhkar', 'காலை, மாலை, இரவு அதுகார்')}</h3>${seg}
    <p class="mute">${cur === 'm' ? tx('After Fajr until the sun is well up.', 'ஃபஜ்ருக்குப் பின், சூரியன் நன்கு உயரும் வரை.') : cur === 'e' ? tx('After Asr until night.', 'அஸ்ருக்குப் பின், இரவு வரை.') : tx('Before sleeping.', 'தூங்குவதற்கு முன்.')} ${tx('Tap each line to count.', 'எண்ண ஒவ்வொரு வரியையும் தொடவும்.')}</p>
    <div class="list wl">${rows}</div>
    <div class="row"><button class="sec" data-act="akreset">${tx('Reset today', 'இன்றைய எண்ணிக்கையை அழி')}</button></div></div>`;
}
function tasbihPage() {
  const tg = TS.t, pct = tg ? Math.min(100, Math.round((TS.n % tg || (TS.n ? tg : 0)) * 100 / tg)) : 0;
  const opts = [33, 34, 100, 0].map((n) => `<button class="${TS.t === n ? 'on' : ''}" data-act="tsbt" data-v="${n}">${n || '∞'}</button>`).join('');
  return `<div class="card" style="text-align:center"><h3>📿 ${tx('Tasbih counter', 'தஸ்பீஹ் எண்ணி')}</h3>
    <div class="seg">${opts}</div>
    <button class="tsb" data-act="tsb" aria-label="count"><span class="tn">${TS.n}</span><small>${tg ? tx('target ', 'இலக்கு ') + tg : ''}</small></button>
    <div class="row" style="justify-content:center"><button class="sec" data-act="tsbreset">${tx('Reset', 'மீட்டமை')}</button></div>
    <p class="mute">${tx('After each prayer: SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34 (Muslim 595). Your phone vibrates at the target.', 'ஒவ்வொரு தொழுகைக்குப் பின்: ஸுப்ஹானல்லாஹ் 33, அல்ஹம்துலில்லாஹ் 33, அல்லாஹு அக்பர் 34 (முஸ்லிம் 595). இலக்கை அடைந்தால் போன் அதிரும்.')}</p></div>`;
}
function extraTimes(t, now) {
  const f = (d) => (d ? fmt(d) : '--');
  const tm = timesFor(new Date(now.getTime() + 86400000));
  const mn = (d, m) => (d ? new Date(d.getTime() + m * 60000) : null);
  let tah = '--';
  if (t.Maghrib && tm.Fajr) { const night = tm.Fajr - t.Maghrib; tah = fmt(new Date(tm.Fajr.getTime() - night / 3)) + ' - ' + fmt(tm.Fajr); }
  const row = (a, b) => `<tr><td>${a}</td><td class="t" style="font-size:15px">${b}</td></tr>`;
  return `<div class="card"><details class="ad"><summary>🌙 ${tx('More times (Tahajjud, Duha, forbidden)', 'மேலும் நேரங்கள் (தஹஜ்ஜுத், ளுஹா, தடுக்கப்பட்டவை)')}</summary>
    <table class="tbl"><tbody>
    ${row(tx('Tahajjud - last third of the night', 'தஹஜ்ஜுத் - இரவின் கடைசி மூன்றில் ஒன்று'), tah)}
    ${row(tx('Duha prayer (about)', 'ளுஹா தொழுகை (சுமார்)'), f(mn(t.Sunrise, 15)) + ' - ' + f(mn(t.Dhuhr, -10)))}
    ${row(tx('No prayer: sunrise', 'தொழுகை கூடாது: சூரிய உதயம்'), f(t.Sunrise) + ' - ' + f(mn(t.Sunrise, 15)))}
    ${row(tx('No prayer: sun at its peak', 'தொழுகை கூடாது: உச்சி நேரம்'), f(mn(t.Dhuhr, -10)) + ' - ' + f(t.Dhuhr))}
    ${row(tx('No prayer: sunset', 'தொழுகை கூடாது: சூரிய அஸ்தமனம்'), f(mn(t.Maghrib, -15)) + ' - ' + f(t.Maghrib))}
    </tbody></table>
    <p class="mute">${tx('Tahajjud: Allah descends to the lowest heaven in the last third of the night (Bukhari 1145). Forbidden times: Muslim 831. Duha: Muslim 748. These are close estimates, not exact.', 'தஹஜ்ஜுத்: இரவின் கடைசி மூன்றில் ஒன்றில் அல்லாஹ் கீழ் வானத்துக்கு இறங்குகிறான் (புகாரி 1145). தடுக்கப்பட்ட நேரங்கள்: முஸ்லிம் 831. ளுஹா: முஸ்லிம் 748. இவை நெருக்கமான மதிப்பீடுகள், துல்லியமானவை அல்ல.')}</p></details></div>`;
}

const IQAMAH_LINES = [
  { ar: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', tr: 'Allahu Akbar, Allahu Akbar', ta: 'அல்லாஹ் மிகப் பெரியவன், அல்லாஹ் மிகப் பெரியவன்', n: '2' },
  { ar: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ', tr: 'Ash-hadu al-laa ilaaha illallaah', ta: 'அல்லாஹ்வைத் தவிர வணக்கத்துக்குரியவன் இல்லை என்று சாட்சி கூறுகிறேன்', n: '1' },
  { ar: 'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ', tr: 'Ash-hadu anna Muhammadan Rasoolullaah', ta: 'முஹம்மத் அல்லாஹ்வின் தூதர் என்று சாட்சி கூறுகிறேன்', n: '1' },
  { ar: 'حَيَّ عَلَى الصَّلَاةِ', tr: "Hayya 'alas-salaah", ta: 'தொழுகைக்கு வாருங்கள்', n: '1' },
  { ar: 'حَيَّ عَلَى الْفَلَاحِ', tr: "Hayya 'alal-falaah", ta: 'வெற்றியின் பக்கம் வாருங்கள்', n: '1' },
  { ar: 'قَدْ قَامَتِ الصَّلَاةُ', tr: 'Qad qaamatis-salaah', ta: 'தொழுகை நிலைநிறுத்தப்பட்டுவிட்டது', n: '2' },
  { ar: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', tr: 'Allahu Akbar, Allahu Akbar', ta: 'அல்லாஹ் மிகப் பெரியவன், அல்லாஹ் மிகப் பெரியவன்', n: '2' },
  { ar: 'لَا إِلَهَ إِلَّا اللَّهُ', tr: 'Laa ilaaha illallaah', ta: 'அல்லாஹ்வைத் தவிர வணக்கத்துக்குரியவன் இல்லை', n: '1' }
];
function pageAdhanWords() {
  return `<div class="card"><h3>📢 ${tx('The Adhan (call to prayer)', 'அதான் (தொழுகை அழைப்பு)')}</h3>
    <p class="mute">${tx('Said by the muezzin when the time starts. Fajr has one extra line.', 'நேரம் தொடங்கியதும் முஅத்தின் கூறுவது. ஃபஜ்ருக்கு மட்டும் ஒரு கூடுதல் வரி உண்டு.')}</p>
    <div class="list wl">${ADHAN_LINES.map((l, i) => `<div class="lrow wr"><span class="li">${i + 1}</span><span class="lt"><span class="ar" lang="ar" dir="rtl">${l.ar}</span><small>${l.tr}</small><small lang="ta">${l.ta}</small><small lang="ta" class="nn">${l.n}</small></span></div>`).join('')}</div>
    <p style="font-size:13px"><b>${tx('After the Adhan:', 'அதானுக்குப் பின்:')}</b> ${tx('repeat what the muezzin says, then send salawat on the Prophet ﷺ and ask Allah for the Wasila for him (Muslim 384, Bukhari 614).', 'முஅத்தின் கூறுவதைப் போலவே கூறவும்; பின்னர் நபி ﷺ மீது ஸலவாத் கூறி அவர்களுக்காக வஸீலாவைக் கேட்கவும் (முஸ்லிம் 384 (API 628), புகாரி 614).')}</p></div>`;
}
function pageIqamah() {
  return `<div class="card"><h3>🗣️ ${tx('The Iqamah (start of the congregation)', 'இகாமத் (ஜமாஅத் தொடக்கம்)')}</h3>
    <p class="mute">${tx('Said just before the congregational prayer begins, after the wudu is done. Most phrases once; "Qad qaamatis-salaah" twice.', 'உளூ முடிந்து ஜமாஅத் தொடங்கும் முன் கூறப்படுகிறது. பெரும்பாலான வாசகங்கள் ஒருமுறை; "கத் காமதிஸ் ஸலாஹ்" இருமுறை.')}</p>
    <div class="list wl">${IQAMAH_LINES.map((l, i) => `<div class="lrow wr"><span class="li">${i + 1}</span><span class="lt"><span class="ar" lang="ar" dir="rtl">${l.ar}</span><small>${l.tr}</small><small lang="ta">${l.ta}</small></span><span class="cnt">×${l.n}</span></div>`).join('')}</div>
    <p style="font-size:13px">${tx('Bilal was ordered to say the Adhan in pairs and the Iqamah once, except "Qad qaamatis-salaah" (Bukhari 605, Muslim 378). Another report (Abu Mahdhura, Muslim API 623) has the Adhan with repeated Shahadah; see the hadith.', 'பிலால் (ரலி) அவர்களுக்கு அதானை இரட்டையாகவும் இகாமத்தை ஒற்றையாகவும் (கத் காமதிஸ் ஸலாஹ் தவிர) கூறக் கட்டளையிடப்பட்டது (புகாரி 605, முஸ்லிம் 378 (API 619)). அபூ மஹ்தூரா (ரலி) வழியாக இகாமத் இரட்டையாக வந்த அறிவிப்பும் உள்ளது (அபூதாவூத்); இரண்டும் ஹதீஸ் நூல்களில் உள்ளன.')}</p></div>`;
}
function viewPray() {
  const back = () => backBar('prayback');
  const parts = dailyMore().split(/\n  (?=<div class="card)/);
  if (praySub === 'adhanw') return back() + pageAdhanWords();
  if (praySub === 'iqamah') return back() + pageIqamah();
  if (praySub === 'wudu') return back() + viewWudu();
  if (praySub === 'steps') return back() + viewDaily();
  if (praySub === 'witr') return back() + parts[0] + parts[1];
  if (praySub === 'travel') return back() + parts[2];
  if (praySub === 'mistakes') return back() + parts[3];
  return backBar('tosvc') + `<div class="card"><h3>${tx('Before every prayer, in order', 'ஒவ்வொரு தொழுகைக்கும் முன், வரிசைப்படி')}</h3>
    <p class="mute">${tx('Adhan → Wudu → Iqamah → Prayer. Tap a step.', 'அதான் → உளூ → இகாமத் → தொழுகை. ஒரு படியைத் தொடவும்.')}</p></div>
  <div class="card list">
    ${lrow('praygo', 'adhanw', '1️⃣', tx('Adhan', 'அதான்'), tx('The call to prayer - words and meaning', 'தொழுகை அழைப்பு - வாசகங்களும் பொருளும்'))}
    ${lrow('praygo', 'wudu', '2️⃣', tx('Wudu (ablution)', 'உளூ'), tx('Step by step with duas', 'படிப்படியாக, துஆக்களுடன்'))}
    ${lrow('praygo', 'iqamah', '3️⃣', tx('Iqamah', 'இகாமத்'), tx('Start of the congregation', 'ஜமாஅத் தொடக்கம்'))}
    ${lrow('praygo', 'steps', '4️⃣', tx('The prayer, line by line', 'தொழுகை - வரி வரியாக'), tx('From takbeer to salam', 'தக்பீர் முதல் ஸலாம் வரை'))}</div>
  <div class="card list">
    ${lrow('praygo', 'witr', '🌙', tx('Witr & Sunnah prayers', 'வித்ர் & சுன்னத்'), '')}
    ${lrow('praygo', 'travel', '🧳', tx('Travel prayer', 'பயணத் தொழுகை'), '')}
    ${lrow('praygo', 'mistakes', '⚠️', tx('Common mistakes', 'பொதுவான தவறுகள்'), '')}</div>`;
}
function viewAbout() {
  return `<div class="card"><h2>ISNAD</h2>
    <p class="mute">${tx('Prayer times, prayer guide and duas - all offline.', 'தொழுகை நேரங்கள், தொழுகை வழிகாட்டி, துஆக்கள் - அனைத்தும் இணையம் இல்லாமல்.')} v29.0</p>
    <h3>${tx('Credits', 'நன்றி / ஆதாரங்கள்')}</h3>
    <ul style="font-size:13px">
      <li>${tx('Prayer-time method: Jean Meeus, Astronomical Algorithms', 'தொழுகை நேரக் கணக்கீடு: Jean Meeus, Astronomical Algorithms')}</li>
      <li>${tx('Font: Amiri (SIL Open Font License)', 'எழுத்துரு: Amiri (SIL Open Font License)')}</li>
      <li>${tx('Hadith references: only Sahih Bukhari and Sahih Muslim, as in our API', 'ஹதீஸ் ஆதாரங்கள்: ஸஹீஹ் புகாரி, ஸஹீஹ் முஸ்லிம், சுனன் அபூதாவூத், திர்மிதீ, நஸாயீ')}</li></ul>
    <h3>${tx('Privacy', 'தனியுரிமை')}</h3>
    <p style="font-size:13px">${tx('This app collects no personal data and has no account or ads. Your location and settings stay on your phone. Location is used only when you tap "Use my location".', 'இந்த ஆப் எந்தத் தனிப்பட்ட தகவலையும் சேகரிக்காது; கணக்கு, விளம்பரம் எதுவும் இல்லை. உங்கள் இருப்பிடமும் அமைப்புகளும் உங்கள் போனிலேயே இருக்கும். "என் இருப்பிடத்தைப் பயன்படுத்து" தொடும்போது மட்டுமே இருப்பிடம் பயன்படுத்தப்படும்.')}</p>
    <h3>${tx('Please note', 'குறிப்பு')}</h3>
    <p style="font-size:13px">${tx('Prayer times are calculated and can differ by a minute or two from your mosque. Use the mosque-time settings to match it. This app is a study aid; for rulings consult a qualified scholar.', 'தொழுகை நேரங்கள் கணக்கிடப்பட்டவை; உங்கள் பள்ளிவாசல் நேரத்திலிருந்து ஓரிரு நிமிடம் வேறுபடலாம். பள்ளி நேரத்துக்கு ஏற்ப அமைப்புகளில் மாற்றலாம். இது கற்றலுக்கான உதவி; மார்க்கத் தீர்ப்புகளுக்கு தகுதியான அறிஞரை அணுகவும்.')}</p></div>`;
}

/* ---------------- LIST-STYLE MORE / SETTINGS ---------------- */
function lrow(act, v, icon, title, sub) {
  return `<button class="lrow" data-act="${act}" data-v="${v}"><span class="li">${icon}</span><span class="lt"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span><span class="lc">›</span></button>`;
}
function backBar(act) { return `<div class="backbar"><button class="sec" data-act="${act}">← ${tx('Back', 'பின்செல்')}</button></div>`; }
const METHOD_BY_COUNTRY = { 'United Arab Emirates': 'Dubai', 'Saudi Arabia': 'UmmAlQura', Qatar: 'Qatar', Kuwait: 'Kuwait', Singapore: 'Singapore', Malaysia: 'Singapore', Brunei: 'Singapore', Turkey: 'Turkey', Egypt: 'Egypt', Pakistan: 'Karachi', Bangladesh: 'Karachi', Afghanistan: 'Karachi', 'United States': 'ISNA', Canada: 'ISNA', 'United Kingdom': 'MWL', France: 'MWL', Germany: 'MWL' };
function methodHint() {
  const m = METHOD_BY_COUNTRY[S.country];
  if (!m || m === S.method || !Prayer.METHODS[m]) return '';
  return `<div class="card soft"><p>${tx('Commonly used in ' + S.country + ': ', S.country + '-ல் பொதுவாகப் பயன்படுத்தப்படுவது: ')}<b>${Prayer.METHODS[m].name}</b></p>
    <div class="row"><button class="sec" data-act="usemeth" data-v="${m}">${tx('Use this method', 'இந்த முறையைப் பயன்படுத்து')}</button></div></div>`;
}
function methodDesc(k) { const m = Prayer.METHODS[k]; return 'Fajr ' + m.fajr + '°, ' + (m.ishaMin ? 'Isha ' + m.ishaMin + ' min after Maghrib' : 'Isha ' + m.isha + '°'); }
function setPage(sub) {
  const now = new Date(), ns = notifState();
  const cityOpts = Object.keys(CITIES).map((c) => `<option value="${c}" ${S.city === c ? 'selected' : ''}>${c}</option>`).join('');
  const methOpts = Object.keys(Prayer.METHODS).map((k) => `<option value="${k}" ${S.method === k ? 'selected' : ''}>${Prayer.METHODS[k].name}</option>`).join('');
  const notifLine = ns === 'granted' ? tx('✅ Notifications allowed', '✅ அறிவிப்புகள் அனுமதிக்கப்பட்டுள்ளன')
    : ns === 'denied' ? tx('⛔ Notifications blocked - allow them in app settings', '⛔ அறிவிப்புகள் தடுக்கப்பட்டுள்ளன - ஆப் செட்டிங்ஸில் அனுமதிக்கவும்')
    : ns === 'unsupported' ? tx('Notifications not supported here', 'இங்கு அறிவிப்புகள் ஆதரிக்கப்படவில்லை') : tx('🔔 Notifications not enabled yet', '🔔 அறிவிப்புகள் இன்னும் இயக்கப்படவில்லை');
  if (sub === 'loc') return `<div class="card"><h3>📍 ${tx('Location', 'இருப்பிடம்')}</h3><p class="mute">${tx('Now', 'தற்போது')}: <b>${S.place || '-'}</b></p></div>` + locCards();
  if (sub === 'method') return methodHint() + `<div class="card"><h3>🧮 ${tx('Calculation method', 'கணக்கீட்டு முறை')}</h3>
    <label class="field">${tx('Method', 'முறை')}<select id="methSel">${methOpts}</select></label>
    <p class="mute">${Prayer.METHODS[S.method].name} (${methodDesc(S.method)}) • ${tx('Asr when shadow = object (1x).', 'அஸ்ர்: நிழல் = பொருள் (1x).')}</p></div>`;
  if (sub === 'mosque') return `  <div class="card">
    <h3>🕌 ${tx('Mosque (jamaat) times', 'பள்ளிவாசல் (ஜமாஅத்) நேரம்')}</h3>
    <p class="mute">${tx('Calculated', 'கணக்கிட்டது')}: ${TIME_KEYS.map((k) => KEY_LABEL[k] + ' ' + fmt(Prayer.computeTimes(now, S.lat, S.lng, S.method, S.asr)[k])).join(' • ')}.<br>
    ${tx('Only change this if your mosque jamaat (congregation) time differs from the calculated time. Otherwise leave it empty - nothing is needed.', 'உங்கள் பள்ளிவாசலில் ஜமாஅத் (கூட்டுத் தொழுகை) நேரம் கணக்கிட்ட நேரத்திலிருந்து வேறுபட்டால் மட்டும் இங்கு அமைக்கவும். இல்லையெனில் எதுவும் செய்ய வேண்டாம்; காலியாகவே விடவும்.')}
    ${tx('Fixed time: the exact time to show. +/- min: shift the calculated time.', 'குறிப்பிட்ட நேரம்: காட்ட வேண்டிய சரியான நேரம். +/- நிமிடம்: கணக்கிட்ட நேரத்தை முன்/பின் நகர்த்தும்.')}</p>
    <table class="tbl"><tbody>${TIME_KEYS.map((k) => `<tr><td style="font-size:14px">${KEY_LABEL[k]}</td>
      <td><label class="field">குறிப்பிட்ட நேரம்<input type="time" data-fixed="${k}" value="${S.fixed[k] || ''}"></label></td>
      <td><label class="field">+/- நிமிடம்<input type="number" inputmode="numeric" min="-30" max="30" step="1" data-adj="${k}" value="${S.adj[k] || 0}" style="max-width:80px"></label></td></tr>`).join('')}</tbody></table>
    <div class="row"><button class="sec" data-act="resetadj">கணக்கிட்ட நேரத்துக்கே மீட்டமை</button></div>
  </div>`;
  if (sub === 'adhan') return adhanPage();
  if (sub === 'remind') return `<div class="card"><h3>⏰ ${tx('Remind me', 'நினைவூட்டு')}</h3>
    <label class="field">${tx('When', 'எப்போது')}<select id="leadSel">${[0, 5, 10, 15, 30].map((m) => `<option value="${m}" ${S.lead == m ? 'selected' : ''}>${m ? m + tx(' min before', ' நிமிடத்துக்கு முன்') : tx('At prayer time', 'தொழுகை நேரத்தில்')}</option>`).join('')}</select></label>
    <label class="chk"><input type="checkbox" data-flag="suhoorRem" ${S.suhoorRem ? 'checked' : ''}><span>${tx('Suhoor reminder in Ramadan (40 min before Fajr)', 'ரமளானில் ஸஹர் நினைவூட்டல் (ஃபஜ்ருக்கு 40 நிமிடம் முன்)')}</span></label>
    <label class="chk"><input type="checkbox" data-flag="fastRem" ${S.fastRem ? 'checked' : ''}><span>${tx('Evening reminder before a sunnah fast (Mon/Thu, white days, Arafah, Ashura)', 'சுன்னத் நோன்புக்கு முந்திய மாலை நினைவூட்டல் (திங்கள்/வியாழன், வெள்ளை நாட்கள், அரஃபா, ஆஷூரா)')}</span></label>
    <label class="chk"><input type="checkbox" data-flag="friRem" ${S.friRem ? 'checked' : ''}><span>${tx('Friday (Jumma) reminder', 'வெள்ளிக்கிழமை (ஜும்ஆ) நினைவூட்டல்')}</span></label>
    <p class="mute">${tx('Hijri days follow the Umm al-Qura calendar; use the +/-1 day setting if your moon sighting differs.', 'ஹிஜ்ரி நாட்கள் உம்முல் குரா நாட்காட்டிப்படி; உங்கள் பிறை முடிவு வேறானால் +/-1 நாள் அமைப்பைப் பயன்படுத்தவும்.')}</p>
    <p class="mute">${tx('Tick the prayers you want on the Times screen.', 'எந்தத் தொழுகைக்கு வேண்டும் என்பதை நேரம் திரையில் டிக் செய்யவும்.')}</p></div>
    <div class="card soft">
    <h3>🔔 நினைவூட்டல்கள்</h3>
    <p class="mute" style="font-size:13px">${notifLine}</p>
    <div class="row">
      ${ns !== 'granted' && ns !== 'unsupported' ? '<button class="pri" data-act="notif">நினைவூட்டலை இயக்கு</button>' : ''}
      <button class="sec" data-act="testnotif">சோதனை நினைவூட்டல் அனுப்பு</button>
    </div>
    <p class="mute">${NATIVE
      ? 'அடுத்த 7 நாட்களுக்கான நினைவூட்டல்கள் Android அலாரமாக அமைக்கப்படும்; ஆப் மூடியிருந்தாலும் ஒலிக்கும். வாரத்துக்கு ஒருமுறை ஆப்பைத் திறந்து புதுப்பிக்கவும். தாமதமானால் இந்த ஆப்புக்கு பேட்டரியை "Unrestricted" ஆக அமைக்கவும்.'
      : 'ஆப் திறந்திருக்கும்போதும் பின்னணியில் இயங்கும்போதும் நினைவூட்டல் ஒலிக்கும். பிரவுசர் முழுவதும் மூடப்பட்டால் Android அதை உறங்க வைக்கலாம் - ஆப்பை நிறுவி, பேட்டரியை "Unrestricted" ஆக அமைக்கவும். உறுதிக்கு ஃபஜ்ருக்கு போன் அலாரமும் வைக்கவும்.'}</p>
  </div>`;
  if (sub === 'display') return `<div class="card"><h3>🎨 ${tx('Language, text size, theme', 'மொழி, எழுத்து அளவு, தோற்றம்')}</h3>
    <p class="mute">${tx('Language', 'மொழி')}</p><div class="seg"><button class="${S.lang !== 'en' ? 'on' : ''}" data-act="setlang" data-v="ta">தமிழ்</button><button class="${S.lang === 'en' ? 'on' : ''}" data-act="setlang" data-v="en">English</button></div>
    <p class="mute">${tx('Text size', 'எழுத்து அளவு')}</p><div class="seg"><button class="${!S.fs ? 'on' : ''}" data-act="setfs" data-v="0">${tx('Normal', 'சாதாரணம்')}</button><button class="${S.fs == 1 ? 'on' : ''}" data-act="setfs" data-v="1">${tx('Large', 'பெரியது')}</button><button class="${S.fs == 2 ? 'on' : ''}" data-act="setfs" data-v="2">${tx('Extra large', 'மிகப் பெரியது')}</button></div>
    <p class="mute">${tx('Hijri date (moon sighting): shift by', 'ஹிஜ்ரி தேதி (பிறை பார்த்தல்): மாற்றம்')}</p><div class="seg">${[-1, 0, 1].map((n) => `<button class="${(S.hadj || 0) === n ? 'on' : ''}" data-act="hadj" data-v="${n}">${n > 0 ? '+' + n : n} ${tx('day', 'நாள்')}</button>`).join('')}</div>
    <p class="mute">${tx('Theme', 'தோற்றம்')}</p><div class="seg"><button class="${S.dark === null ? 'on' : ''}" data-act="settheme" data-v="auto">${tx('Auto', 'தானியங்கி')}</button><button class="${S.dark === false ? 'on' : ''}" data-act="settheme" data-v="light">${tx('Light', 'வெளிச்சம்')}</button><button class="${S.dark === true ? 'on' : ''}" data-act="settheme" data-v="dark">${tx('Dark', 'இருள்')}</button></div></div>`;
  return '';
}
function adhanPage() {
  const v = voiceOf();
  const voiceSel = ADH.voices.length > 1 ? `<label class="field">${tx('Adhan voice', 'அதான் குரல்')}<select id="voiceSel">${ADH.voices.map((x) => `<option value="${x.id}" ${v && v.id === x.id ? 'selected' : ''}>${x.label}</option>`).join('')}</select></label>` : '';
  return `<div class="card">
    <h3>📢 ${tx('Adhan', 'அதான்')}</h3>
    <label class="chk"><input type="checkbox" data-adhan ${S.adhan ? 'checked' : ''}><span>${tx('Play the Adhan at prayer time', 'தொழுகை நேரத்தில் அதான் ஒலிக்கச் செய்')}</span></label>
    ${voiceSel}
    <p class="mute">${ADH.main ? tx('Adhan recording ready ✓', 'அதான் பதிவு தயார் ✓') : tx('No Adhan recording in this app yet - a soft chime plays instead.', 'அதான் பதிவு இன்னும் இல்லை - மென்மையான மணி ஒலி ஒலிக்கும்.')}${NATIVE ? ' ' + tx('It also sounds as a notification when the app is closed.', 'ஆப் மூடியிருந்தாலும் அறிவிப்பாக ஒலிக்கும்.') : ' ' + tx('On the web it plays while the app is open.', 'வலைப்பக்கத்தில் ஆப் திறந்திருக்கும்போது மட்டும் ஒலிக்கும்.')}</p>
    <div class="row">
      <button class="pri" data-act="adhanplay">▶ ${tx('Preview', 'கேட்டுப் பார்')}</button>
      ${ADH.fajr ? `<button class="sec" data-act="adhanfajr">▶ ${tx('Fajr Adhan', 'ஃபஜ்ர் அதான்')}</button>` : ''}
      ${ADH.playing ? `<button class="sec" data-act="adhanstop">⏹ ${tx('Stop', 'நிறுத்து')}</button>` : ''}
    </div>
    ${ATH ? `<label class="chk"><input type="checkbox" data-act="alarmscreen" ${S.alarmScreen !== false ? 'checked' : ''}><span>${tx('Show the full-screen Adhan screen with a Stop button (also on the lock screen)', 'பூட்டுத் திரையிலும் "நிறுத்து" பொத்தானுடன் முழுத்திரை அதான் காட்டு')}</span></label>
    ${ATHST && ATHST.fullScreen === false ? `<div class="note">${tx('Android needs your permission to open the Adhan screen over the lock screen.', 'பூட்டுத் திரையில் அதான் திரையைத் திறக்க உங்கள் அனுமதி தேவை.')} <button class="sec" data-act="athperm" data-w="fullscreen">${tx('Allow', 'அனுமதி')}</button></div>` : ''}
    ${ATHST && ATHST.exact === false ? `<div class="note">${tx('Allow "Alarms & reminders" so the Adhan comes exactly on time.', '"Alarms & reminders" அனுமதியுங்கள்; அப்போது அதான் சரியான நேரத்தில் வரும்.')} <button class="sec" data-act="athperm" data-w="exact">${tx('Allow', 'அனுமதி')}</button></div>` : ''}
    <div class="row"><button class="sec" data-act="athtest">🔔 ${tx('Test the full-screen Adhan (10 s)', 'முழுத்திரை அதானைச் சோதி (10 வினாடி)')}</button></div>` : ''}
    ${NATIVE ? `<div class="row"><button class="sec" data-act="adhandiag">🔧 ${tx('Test the Adhan notification (10 s)', 'அதான் அறிவிப்பைச் சோதி (10 வினாடி)')}</button></div>
    ${ADH.diag ? `<pre class="diag">${ADH.diag}</pre>` : ''}` : ''}
    <details class="ad"><summary>🔋 ${tx('Adhan not sounding? Phone settings', 'அதான் ஒலிக்கவில்லையா? போன் அமைப்புகள்')}</summary>
      <ol class="guide">
        <li>${tx('Settings > Apps > ISNAD > Notifications: allow, and keep the Adhan sound on.', 'Settings > Apps > ISNAD > Notifications: அனுமதிக்கவும்; அதான் ஒலி இயக்கத்தில் இருக்கட்டும்.')}</li>
        <li>${tx('Settings > Apps > ISNAD > Battery: choose Unrestricted (or "No restrictions" / "Don\'t optimise").', 'Settings > Apps > ISNAD > Battery: "Unrestricted" (அல்லது "No restrictions" / "Don\'t optimise") தேர்ந்தெடுக்கவும்.')}</li>
        <li>${tx('Android 12+: Settings > Apps > Special access > Alarms & reminders > allow for this app.', 'Android 12+: Settings > Apps > Special access > Alarms & reminders > இந்த ஆப்புக்கு அனுமதி.')}</li>
        <li><b>Xiaomi / Redmi / POCO:</b> ${tx('Security app > Permissions > Autostart: ON. Battery saver: No restrictions. In the recent-apps list, lock the app.', 'Security ஆப் > Permissions > Autostart: ON. Battery saver: No restrictions. Recent apps பட்டியலில் இந்த ஆப்பைப் "lock" செய்யவும்.')}</li>
        <li><b>Samsung:</b> ${tx('Battery > Background usage limits > Never sleeping apps > add ISNAD.', 'Battery > Background usage limits > Never sleeping apps > ISNAD-ஐச் சேர்க்கவும்.')}</li>
        <li><b>Oppo / Realme / OnePlus / Vivo:</b> ${tx('Allow Auto-launch and Background activity for the app; set battery to "High" or "Allow".', 'ஆப்புக்கு Auto-launch மற்றும் Background activity அனுமதி கொடுக்கவும்; battery "High" அல்லது "Allow" ஆக வைக்கவும்.')}</li>
        <li>${tx('The Adhan uses the notification volume. Silent mode or Do-not-disturb will mute it.', 'அதான் "notification volume"-ல் ஒலிக்கும். Silent mode அல்லது Do-not-disturb இருந்தால் ஒலி வராது.')}</li>
      </ol>
      <p class="mute">${tx('Menu names differ by phone model.', 'போன் மாடலுக்கு ஏற்ப மெனு பெயர்கள் மாறுபடலாம்.')}</p>
    </details>
    <details class="ad"><summary>📁 சொந்த அதான் ஒலிக்கோப்பு</summary>
      <p class="mute">உங்கள் போனிலுள்ள அதான் mp3 கோப்பைத் தேர்ந்தெடுக்கவும். இது ஆப் திறந்திருக்கும்போது ஒலிக்கும். ஆப் மூடியிருக்கும்போது ஒலிக்க, கோப்பை adhan/adhan.mp3-ஆகச் சேர்த்து APK-ஐ மீண்டும் உருவாக்கவும்.</p>
      <label class="field">அதான் (எல்லா நேரங்களுக்கும்)<input type="file" accept="audio/*" data-adhanfile="adhan"></label>
      <label class="field">ஃபஜ்ர் அதான் (விருப்பம்)<input type="file" accept="audio/*" data-adhanfile="adhan-fajr"></label>
      <div class="row"><button class="sec" data-act="adhanreset">சொந்தக் கோப்புகளை அகற்று</button></div>
    </details>
    <details class="ad"><summary>அதான் வாசகங்கள்</summary>
      ${ADHAN_LINES.map((l) => `<div class="adl"><div class="ar" lang="ar">${l.ar}</div><div>${l.tr} <span class="tag">${l.n}</span></div><div lang="ta">${l.ta}</div></div>`).join('')}
      <div class="adl"><b>அதானுக்குப் பின்:</b> முஅத்தின் கூறுவதைப் போலவே கூறவும்; நபி ﷺ அவர்கள் மீது ஸலவாத் கூறவும்; பின்னர் துஆ ஓதவும் - <b>துஆக்கள்</b> பிரிவில் ("அதானுக்குப் பின் துஆ") காண்க.</div>
    </details>
  </div>`;
}
async function adhanDiag() {
  const ok = (b) => (b ? '✓' : '✗');
  const L1 = [];
  await loadAdhan();
  L1.push(ok(ADH.bundled) + ' ' + tx('Adhan recordings inside the app', 'ஆப்பினுள் அதான் ஒலிக்கோப்புகள்') + ': ' + ADH.voices.length + (ADH.fajrFile ? ' + Fajr' : ''));
  let granted = false, exact = true;
  try { const p = await LN.checkPermissions(); granted = p.display === 'granted'; } catch (e) {}
  L1.push(ok(granted) + ' ' + tx('Notification permission', 'அறிவிப்பு அனுமதி'));
  try { const e = await LN.checkExactNotificationSetting(); exact = !e || e.exact_alarm === 'granted'; } catch (e) {}
  L1.push(ok(exact) + ' ' + tx('"Alarms & reminders" permission', '"Alarms & reminders" அனுமதி'));
  if (granted) {
    try {
      await LN.schedule({ notifications: [{ id: 2, title: L('அதான் சோதனை'), body: tx('Adhan test notification', 'அதான் சோதனை அறிவிப்பு'), schedule: { at: new Date(Date.now() + 10000), allowWhileIdle: true }, channelId: adhanChannel('Dhuhr') }] });
      L1.push(tx('Test sent: lock the screen, it comes in 10 seconds.', 'சோதனை அனுப்பப்பட்டது: திரையைப் பூட்டுங்கள், 10 வினாடியில் வரும்.'));
    } catch (e) { L1.push('✗ ' + tx('Could not schedule the test', 'சோதனையை அமைக்க முடியவில்லை')); }
  } else { await enableNotif(); }
  L1.push(tx('No sound? Android Settings > Apps > ISNAD > Notifications > Adhan > Sound. Also check Silent/Do-not-disturb and battery "Unrestricted".', 'ஒலி இல்லையா? Android Settings > Apps > ISNAD > Notifications > அதான் > Sound ஐப் பார்க்கவும்; Silent/Do-not-disturb இல்லையா, பேட்டரி "Unrestricted" ஆக உள்ளதா என்றும் பார்க்கவும்.'));
  ADH.diag = L1.join('\n'); render();
}
function viewSettings() {
  if (setSub) return backBar('setback') + setPage(setSub);
  const lead = S.lead ? S.lead + tx(' min before', ' நிமிடத்துக்கு முன்') : tx('At prayer time', 'தொழுகை நேரத்தில்');
  const hasMosque = TIME_KEYS.some((k) => /^\d{2}:\d{2}$/.test(S.fixed[k]) || S.adj[k]);
  const v = voiceOf();
  return `<div class="card list">
    ${lrow('set', 'loc', '📍', tx('Location', 'இருப்பிடம்'), S.place || '')}
    ${lrow('set', 'method', '🧮', tx('Calculation method', 'கணக்கீட்டு முறை'), Prayer.METHODS[S.method].name)}
    ${lrow('set', 'mosque', '🕌', tx('Mosque (jamaat) times', 'பள்ளிவாசல் (ஜமாஅத்) நேரம்'), hasMosque ? tx('Set', 'அமைக்கப்பட்டது') : tx('Optional - not set', 'விருப்பம் - அமைக்கவில்லை'))}
    ${lrow('set', 'adhan', '📢', tx('Adhan & voice', 'அதான் & குரல்'), (S.adhan ? tx('On', 'இயக்கம்') : tx('Off', 'நிறுத்தம்')) + (v ? ' • ' + v.label : ''))}
    ${lrow('set', 'remind', '🔔', tx('Reminders', 'நினைவூட்டல்'), lead)}
    ${lrow('set', 'display', '🎨', tx('Language, text size, theme', 'மொழி, எழுத்து, தோற்றம்'), (S.lang === 'en' ? 'English' : 'தமிழ்'))}
    ${lrow('svc', 'about', 'ℹ️', tx('About', 'பற்றி'), tx('Credits, privacy', 'நன்றி, தனியுரிமை'))}</div>`;
}
function viewMore() {
  if (moreSub === 'settings') return viewSettings();
  const pages = { track: trackPage, jumma: viewJumma, eid: viewEid, special: viewSpecial, aqeedah: viewAqeedah, about: viewAbout, quran: viewQuran, hadith: viewHadith, courses: viewCourses, qibla: viewQibla };
  if (moreSub && pages[moreSub]) return ['quran','hadith','courses','qibla'].includes(moreSub) ? pages[moreSub]() : backBar('moreback') + pages[moreSub]();
  return viewServices();
}
const VIEWS = { times: viewTimes, pray: viewPray, duas: viewDuas, more: viewMore, set: viewSettings };

/* Long guide pages: each section becomes a tap-to-open accordion (the first one is open) so pages are short and tidy. */
const ACC = new Set();
document.addEventListener('toggle', (e) => { const d = e.target; if (d && d.classList && d.classList.contains('acc')) { const k = (d.querySelector('summary') || {}).textContent; if (d.open) ACC.add(k); else ACC.delete(k); } }, true);
function tidy() {
  const guide = (tab === 'more' && ['jumma', 'eid', 'special', 'aqeedah'].includes(moreSub)) || (tab === 'pray' && praySub && ['steps', 'witr', 'travel', 'mistakes', 'adhanw', 'iqamah', 'wudu'].includes(praySub));
  const duaRoot = tab === 'duas' && !duaOpen && !akSet;
  if (!guide && !duaRoot) return;
  const m = $('main');
  const cards = [...m.querySelectorAll(duaRoot ? ':scope > .card' : '.card .card, .grid > .card, .grid .card')].filter((c) => c.querySelector(':scope > h3, :scope > h2'));
  let first = true;
  cards.forEach((c) => {
    if (!c.isConnected) return;
    const h = c.querySelector(':scope > h3, :scope > h2');
    const key = h.textContent;
    const d = document.createElement('details'); d.className = 'acc';
    if ((first && !duaRoot) || ACC.has(key)) d.open = true; first = false;
    const sm = document.createElement('summary'); sm.textContent = key; h.remove();
    const b = document.createElement('div'); b.className = 'accb';
    while (c.firstChild) b.appendChild(c.firstChild);
    d.appendChild(sm); d.appendChild(b); c.replaceWith(d);
  });
  m.querySelectorAll(':scope > .card').forEach((c) => { if (c.querySelector('details.acc')) c.classList.add('plain'); });
}
function render() {
  const y = window.scrollY;
  try { const nb = document.querySelector('header .next'); if (nb) nb.style.display = tab === 'times' ? 'none' : ''; } catch (e) {}
  try { const hd = document.querySelector('header'); if (hd) document.documentElement.style.setProperty('--hh', hd.offsetHeight + 'px'); } catch (e) {}
  const rootTitle = (tab === 'times' || (tab === 'more' && !moreSub) || (tab === 'set' && !setSub)) ? `<div class="ptitle">${TAB_LABEL()[tab]}</div>` : '';
  $('main').innerHTML = (rootTitle + VIEWS[tab]()).replace(/\u06DD/g, ' ﴾﴿ ') + `<footer><div class="card" style="display:inline-block;padding:12px 16px;margin:0">அனைத்து முஸ்லிம் சமூகத்துக்காக<br>ஸஹீஹான ஹதீஸ்களின் அடிப்படையில் உருவாக்கப்பட்டது • ஆஃப்லைன் • v29.0</div></footer>`;
  const navTab = (tab === 'pray' || tab === 'duas') ? 'more' : tab;
  $('nav').innerHTML = TABS.map((t) => `<button class="${navTab === t.id ? 'on' : ''}" data-tab="${t.id}"><span class="ic">${t.icon}</span><span class="lb">${TAB_LABEL()[t.id]}</span></button>`).join('');
  tidy();
  applyLang();
  try { linkRefs($('main')); } catch (e) {}
  window.scrollTo(0, y);
}

/* ---------------- EVENTS ---------------- */
document.addEventListener('click', (e) => {
  const tb = e.target.closest('[data-tab]');
  if (tb) { if (tb.dataset.tab === 'more') { moreSub = null; setSub = null; Q.s = null; H.b = null; C.id = null; } if (tb.dataset.tab === 'set') setSub = null; if (tb.dataset.tab === 'pray') praySub = null; if (tb.dataset.tab === 'duas') { duaOpen = null; akSet = null; } tab = tb.dataset.tab; render(); window.scrollTo(0, 0); return; }
  const a = e.target.closest('[data-act]');
  if (!a) return;
  const act = a.dataset.act;
  if (typeof contentAct === 'function' && contentAct(act, a)) return;
  if (act === 'copy') { const d = DUAS.find((x) => x.id === a.dataset.id); copyText([d.title, d.arabic, d.tp ? tx('Pronunciation: ', 'உச்சரிப்பு: ') + d.tp : d.tr, d.ta ? tx('Meaning: ', 'பொருள்: ') + d.ta : d.en, `[${d.ref}]`].filter(Boolean).join('\n\n'), d.id); }
  else if (act === 'speak') speak(a.dataset.id);
  else if (act === 'pray') { selPrayer = a.dataset.key; render(); }
  else if (act === 'more') { moreSub = a.dataset.v; setSub = null; render(); window.scrollTo(0, 0); }
  else if (act === 'moreback') { moreSub = null; setSub = null; render(); window.scrollTo(0, 0); }
  else if (act === 'set') { setSub = a.dataset.v; render(); window.scrollTo(0, 0); }
  else if (act === 'setback') { setSub = null; render(); window.scrollTo(0, 0); }
  else if (act === 'gosettings') { tab = 'set'; setSub = null; render(); window.scrollTo(0, 0); }
  else if (act === 'setlang') { S.lang = a.dataset.v === 'en' ? 'en' : 'ta'; save(); render(); setNet(); tick(); updateWidget(); }
  else if (act === 'setfs') { S.fs = +a.dataset.v; applyFs(); save(); render(); }
  else if (act === 'settheme') { S.dark = a.dataset.v === 'auto' ? null : a.dataset.v === 'dark'; applyTheme(); save(); render(); }
  else if (act === 'adhandiag') adhanDiag();
  else if (act === 'alarmscreen') { S.alarmScreen = a.checked; save(); scheduleNative(); }
  else if (act === 'athtest') athanTest();
  else if (act === 'athperm') { ATH && ATH.openSettings({ what: a.dataset.w }); }
  else if (act === 'sub') { if (a.dataset.key === 'pray') praySub = a.dataset.v; else moreSub = a.dataset.v; render(); window.scrollTo(0, 0); }
  else if (act === 'filter') { duaFilter = a.dataset.key; render(); }
  else if (act === 'gps') useGPS();
  else if (act === 'pickcity') { const c = CITYDB[+a.dataset.i]; if (c) { S.city = c[0]; S.country = c[1] || ''; S.lat = c[2]; S.lng = c[3]; S.place = c[1] ? c[0] + ', ' + c[1] : c[0]; save(); render(); window.scrollTo(0, 0); toast(tx('Location set ✓', 'இருப்பிடம் அமைக்கப்பட்டது ✓')); } }
  else if (act === 'setcoords') {
    const la = parseFloat(($('cLat') || {}).value), ln = parseFloat(($('cLng') || {}).value), nm = (($('cName') || {}).value || '').trim();
    if (!(la >= -90 && la <= 90) || !(ln >= -180 && ln <= 180)) { toast(tx('Enter valid latitude (-90 to 90) and longitude (-180 to 180)', 'சரியான அட்சரேகை (-90 முதல் 90) மற்றும் தீர்க்கரேகை (-180 முதல் 180) உள்ளிடவும்')); return; }
    S.lat = +la.toFixed(4); S.lng = +ln.toFixed(4); S.city = 'manual'; S.country = ''; S.place = nm || (S.lat + ', ' + S.lng); save(); render(); window.scrollTo(0, 0); toast(tx('Location set ✓', 'இருப்பிடம் அமைக்கப்பட்டது ✓'));
  }
  else if (act === 'praygo') { praySub = a.dataset.v; render(); window.scrollTo(0, 0); }
  else if (act === 'prayback') { praySub = null; render(); window.scrollTo(0, 0); }
  else if (act === 'trk') { const o = TR[a.dataset.d] || {}; o[a.dataset.k] = o[a.dataset.k] ? 0 : 1; TR[a.dataset.d] = o; trSave(); buzz(10); render(); }
  else if (act === 'trlog') { e.preventDefault(); tab = 'more'; moreSub = 'track'; setSub = null; render(); window.scrollTo(0, 0); }
  else if (act === 'usemeth') { S.method = a.dataset.v; save(); render(); toast(tx('Method changed', 'முறை மாற்றப்பட்டது')); }
  else if (act === 'akset') { akSet = a.dataset.v; render(); }
  else if (act === 'akinc') { akCheckDay(); const k = a.dataset.set + ':' + a.dataset.id, d = ADHKAR[a.dataset.set].find((x) => x.id === a.dataset.id); if (d) { const c = (AK.c[k] || 0); if (c < d.n) { AK.c[k] = c + 1; buzz(AK.c[k] >= d.n ? [30, 40, 30] : 12); } else AK.c[k] = 0; akSave(); render(); } }
  else if (act === 'akreset') { AK = { d: dayKey(new Date()), c: {} }; akSave(); render(); }
  else if (act === 'tsb') { TS.n++; tsSave(); buzz(TS.t && TS.n % TS.t === 0 ? [60, 50, 60] : 12); render(); }
  else if (act === 'tsbt') { TS.t = +a.dataset.v; TS.n = 0; tsSave(); render(); }
  else if (act === 'tsbreset') { TS.n = 0; tsSave(); render(); }
  else if (act === 'hadj') { S.hadj = +a.dataset.v; save(); render(); }
  else if (act === 'duaopen') { duaOpen = a.dataset.v; render(); window.scrollTo(0, 0); }
  else if (act === 'duaback') { duaOpen = null; render(); window.scrollTo(0, 0); }
  else if (act === 'compass') compassToggle();
  else if (act.startsWith('q')) qClick(act, a);
  else if (act === 'adhanplay' || act === 'adhanfajr') {
    playAdhan(act === 'adhanfajr' ? 'Fajr' : 'Dhuhr').then((ok) => { if (!ok) toast('மீண்டும் தொடவும் - போன் ஒலியைத் தடுத்தது'); });
  }
  else if (act === 'adhanstop') stopAdhan();
  else if (act === 'adhanreset') { Promise.all([idbSet('adhan', null), idbSet('adhan-fajr', null)]).then(() => { ADH.p = null; ADH.main = ADH.fajr = false; return loadAdhan(); }).then(() => { toast('சொந்தக் கோப்புகள் அகற்றப்பட்டன'); render(); }); }
  else if (act === 'resetadj') {
    for (const k of TIME_KEYS) { S.fixed[k] = ''; S.adj[k] = 0; }
    save(); render(); toast('கணக்கிட்ட நேரங்கள் பயன்படுத்தப்படுகின்றன');
  }
  else if (act === 'notif') enableNotif();
  else if (act === 'testnotif' && LN) {
    (async () => {
      if (notifState() !== 'granted') await enableNotif();
      if (notifState() !== 'granted') return;
      try {
        await LN.schedule({ notifications: [{ id: 1, title: L('சோதனை நினைவூட்டல்'), body: L('நினைவூட்டல்கள் வேலை செய்கின்றன ✓'), schedule: { at: new Date(Date.now() + 3000), allowWhileIdle: true }, channelId: 'prayer' }] });
        toast('3 வினாடியில் சோதனை நினைவூட்டல் - திரையைப் பூட்டிப் பார்க்கவும்');
      } catch (e) { toast('சோதனை நினைவூட்டலை அமைக்க முடியவில்லை'); }
    })();
  }
  else if (act === 'testnotif') {
    if (notifState() === 'default') enableNotif().then(() => showNotification('சோதனை நினைவூட்டல்', 'நினைவூட்டல்கள் வேலை செய்கின்றன ✓', 'thw-test'));
    else showNotification('சோதனை நினைவூட்டல்', 'நினைவூட்டல்கள் வேலை செய்கின்றன ✓', 'thw-test');
  }
});
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'citySearch') { const r = $('cityRes'); if (r) r.innerHTML = cityRows(e.target.value); }
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.adhanfile) {
    const f = t.files && t.files[0];
    if (!f) return;
    if (f.size > 12 * 1024 * 1024) { toast('கோப்பு மிகப் பெரியது (12 MB-க்குள் தேர்ந்தெடுக்கவும்)'); return; }
    idbSet(t.dataset.adhanfile, f).then((ok) => { if (!ok) { toast('கோப்பைச் சேமிக்க முடியவில்லை'); return; } ADH.p = null; ADH.main = ADH.fajr = false; return loadAdhan().then(() => { toast('அதான் கோப்பு சேமிக்கப்பட்டது ✓'); render(); }); });
    return;
  }
  if (t.id === 'voiceSel') { S.voice = t.value; save(); const v = voiceOf(); toast((S.lang === 'en' ? 'Adhan voice: ' : 'அதான் குரல்: ') + (v ? v.label : '')); return; }
  if (t.id === 'citySel') {
    if (t.value === 'gps') useGPS();
    else if (!t.value || !CITIES[t.value]) return;
    else { S.city = t.value; S.lat = CITIES[t.value][0]; S.lng = CITIES[t.value][1]; S.place = t.value; save(); render(); }
  } else if (t.dataset.flag) { S[t.dataset.flag] = t.checked; save(); }
  else if (t.id === 'methSel') { S.method = t.value; save(); render(); }
  else if (t.id === 'leadSel') { S.lead = +t.value; save(); toast('நினைவூட்டல்: ' + (S.lead ? S.lead + ' நிமிடத்துக்கு முன்' : 'தொழுகை நேரத்தில்')); }
  else if (t.dataset.adhan !== undefined) { S.adhan = t.checked; save(); toast(S.adhan ? 'அதான் இயக்கப்பட்டது' : 'அதான் நிறுத்தப்பட்டது'); }
  else if (t.dataset.fixed) { S.fixed[t.dataset.fixed] = t.value || ''; save(); render(); }
  else if (t.dataset.adj) {
    const v = Math.max(-30, Math.min(30, parseInt(t.value, 10) || 0));
    S.adj[t.dataset.adj] = v; save(); render();
  }
  else if (t.dataset.remind) {
    S.remind[t.dataset.remind] = t.checked; save();
    if (t.checked && notifState() === 'default') enableNotif();
  } else if (t.dataset.rafu) {
    rafu[t.dataset.rafu] = t.checked;
    t.closest('label').classList.toggle('done', t.checked);
  }
});
$('bannerX').addEventListener('click', () => { stopAdhan(); $('banner').classList.add('hidden'); });

/* online / install */
function setNet() { const el = $('net'); el.textContent = navigator.onLine ? tx('Online', 'ஆன்லைன்') : tx('Offline Mode', 'ஆஃப்லைன்'); el.classList.toggle('off', !navigator.onLine); }
window.addEventListener('online', setNet); window.addEventListener('offline', setNet); setNet();
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; $('install').style.display = 'inline-block'; });
$('install').addEventListener('click', async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  const r = await deferredInstall.userChoice;
  if (r.outcome === 'accepted') toast('ஆப் நிறுவப்படுகிறது... அல்ஹம்துலில்லாஹ் ✓');
  deferredInstall = null; $('install').style.display = 'none';
});
window.addEventListener('appinstalled', () => { $('install').style.display = 'none'; });

/* service worker */
if ('serviceWorker' in navigator && !NATIVE) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) updateWidget(); });
/* ---------------- TICK ---------------- */
let lastDay = dayKey(new Date());
function tick() {
  const now = new Date();
  const nx = nextPrayer(now);
  if (nx) {
    $('nxName').textContent = KEY_LABEL[nx.key];
    $('nxTime').textContent = fmt(nx.at);
    $('nxCount').textContent = tx('in ', 'இன்னும் ') + countdown(nx.at - now);
    const hc = document.getElementById('heroCount');
    if (hc) { hc.textContent = tx('in ', 'இன்னும் ') + countdown(nx.at - now); document.getElementById('heroName').textContent = KEY_LABEL[nx.key]; document.getElementById('heroTime').textContent = fmt(nx.at); }
  }
  checkReminders();
  if (dayKey(now) !== lastDay) { lastDay = dayKey(now); if (tab === 'times' || tab === 'pray') render(); }
}
document.addEventListener('toggle', (e) => { if (e.target.id === 'setd') setOpen = e.target.open; }, true);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tick(); if (tab === 'times') render(); } });

const FS_LEVELS = [1, 1.2, 1.4];
function applyFs() {
  const i = Math.max(0, Math.min(2, +S.fs || 0));
  try { document.documentElement.style.setProperty('--fs', FS_LEVELS[i]); } catch (e) {}
  const b = document.getElementById('fsBtn'); if (b) b.textContent = ['Aa', 'Aa+', 'Aa++'][i];
}
applyTheme(); applyFs();
(function () {
  const lbn = document.getElementById('langBtn');
  if (lbn) lbn.addEventListener('click', () => { S.lang = S.lang === 'en' ? 'ta' : 'en'; save(); render(); setNet(); tick(); updateWidget(); });
  const fb = document.getElementById('fsBtn');
  if (fb) fb.addEventListener('click', () => { S.fs = ((+S.fs || 0) + 1) % 3; applyFs(); save(); render(); toast(['எழுத்து: சாதாரணம்', 'எழுத்து: பெரியது', 'எழுத்து: மிகப் பெரியது'][S.fs]); });
  const b = document.getElementById('themeBtn');
  if (b) b.addEventListener('click', () => { S.dark = !isDark(); applyTheme(); save(); });
  try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.dark === null) applyTheme(); }); } catch (e) {}
})();
render();
tick();
setInterval(tick, 1000);
loadAdhan().then(() => { if (tab === 'times') render(); });
initNative().then(() => { if (tab === 'times') render(); });
if (S.city === 'gps') reverseGeocode();
