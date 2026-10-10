/* PYGENIC ARC — Multilingual Voice Website Guide
   Offline guided FAQ, translation for key interface labels, and browser voice APIs.
   This is NOT an LLM or Agentic AI. Speech recognition/voices depend on browser.
   The guide speaks only after a user initiates a request. No audio stored/uploaded.
*/
(() => {
  'use strict';
  const init=()=>{
    if(document.getElementById('pvoice-launch')) return;
    const SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;
    const locales={en:'en-IN',kn:'kn-IN',hi:'hi-IN',ta:'ta-IN',te:'te-IN',ml:'ml-IN'};
    const languageNames={en:'English',kn:'ಕನ್ನಡ',hi:'हिन्दी',ta:'தமிழ்',te:'తెలుగు',ml:'മലയാളം'};
    const d={
      en:{hello:'Hello! I am your Pygenic Arc voice guide. How can I help you?',name:'Voice Guide',help:'How can I help you?',listen:'Speak',send:'Send',speak:'Read aloud',close:'Close',stop:'Stop voice',hint:'Type or speak a question about this website.',micro:'This browser does not support voice input here. Please type your question, or try Chrome or Edge on a secure website.',denied:'Microphone could not start. Please check browser permissions or type your question.',failed:'Sorry, I could not understand. Please try again or type your question.',nav:'Choose a section using the navigation bar. In Scenarios, choose Hospital, College, Banking, or Shopping, then click Analyze Scenario.',about:'Pygenic Arc is an educational cloud attack-path analyzer. It uses fictional cloud data to show how exposed access and overly broad permissions can lead to important assets.',path:'An attack path is a possible chain of access from an exposed entry point to a critical asset, such as a database.',blast:'Blast radius is the number of resources potentially reachable from exposed entry points in the simulation.',fix:'Open Remediation or Scenarios. Select Recommended Fixes, then Apply Simulated Fixes to see whether dangerous paths are blocked. No real cloud systems are changed.',upload:'Open Scenarios and find the JSON upload control. Select a synthetic configuration file that follows the displayed format and size limits. Real cloud credentials should never be uploaded.',risk:'Risk scores are simplified estimates for fictional configurations. Look at each path and the modeled permissions before choosing a fix.',scenario:'Choose Hospital, College, Banking, or Shopping on the Home page. Analyze a scenario to view its possible paths and recommended fixes.',report:'Open Reports to review the synthetic security results and download the text report.',unknown:'I can guide you through scenarios, attack paths, blast radius, file uploads, security risks, and remediation. What would you like to know?',say:'Voice not available for this selected language in your current browser. The answer is shown as text.',lang:'Website language',home:'Home',dashboard:'Dashboard',employees:'Employees',analysis:'Analysis',remediation:'Remediation',scenarios:'Scenarios',reports:'Reports',back:'← Back to Home',welcome:'Explore Security Scenarios',security:'Security Overview'},
      kn:{hello:'ನಮಸ್ಕಾರ! ನಾನು ಪೈಜೆನಿಕ್ ಆರ್ಕ್ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ. ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',name:'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ',help:'ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',listen:'ಮಾತನಾಡಿ',send:'ಕಳುಹಿಸಿ',speak:'ಓದಿ ಹೇಳು',close:'ಮುಚ್ಚಿ',stop:'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',hint:'ವೆಬ್‌ಸೈಟ್ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ.',micro:'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.',denied:'ಮೈಕ್ರೊಫೋನ್ ಆರಂಭವಾಗಲಿಲ್ಲ. ಅನುಮತಿ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.',failed:'ಕ್ಷಮಿಸಿ, ಅರ್ಥವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',nav:'ಮೇಲಿನ ಮೆನುವಿನಿಂದ ವಿಭಾಗ ಆರಿಸಿ. ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಆಸ್ಪತ್ರೆ, ಕಾಲೇಜು, ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಶಾಪಿಂಗ್ ಆಯ್ಕೆ ಮಾಡಿ, ನಂತರ ವಿಶ್ಲೇಷಣೆ ಒತ್ತಿ.',about:'ಪೈಜೆನಿಕ್ ಆರ್ಕ್ ಒಂದು ಶೈಕ್ಷಣಿಕ ಕ್ಲೌಡ್ ಭದ್ರತಾ ಸಾಧನ. ಕಲ್ಪಿತ ಡೇಟಾದಿಂದ ದುರ್ಬಲ ಅನುಮತಿಗಳ ಮೂಲಕ ಪ್ರಮುಖ ಮಾಹಿತಿಗೆ ಹೇಗೆ ಪ್ರವೇಶ ಸಾಧ್ಯ ಎಂದು ತೋರಿಸುತ್ತದೆ.',path:'ಅಟ್ಯಾಕ್ ಪಾತ್ ಎಂದರೆ ಹೊರಗಿನಿಂದ ತೆರೆದಿರುವ ಪ್ರವೇಶದಿಂದ ಪ್ರಮುಖ ಡೇಟಾಬೇಸ್‌ವರೆಗೆ ತಲುಪಬಹುದಾದ ಮಾರ್ಗ.',blast:'ಬ್ಲಾಸ್ಟ್ ರೇಡಿಯಸ್ ಎಂದರೆ ಈ ಮಾದರಿಯಲ್ಲಿ ಅಪಾಯಕ್ಕೆ ಒಳಗಾಗಬಹುದಾದ ಕ್ಲೌಡ್ ಸಂಪನ್ಮೂಲಗಳ ಸಂಖ್ಯೆ.',fix:'ರೆಮಿಡಿಯೇಷನ್ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ. ಶಿಫಾರಸು ಮಾಡಿದ ಪರಿಹಾರಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ನಂತರ ಸಿಮ್ಯುಲೇಟೆಡ್ ಫಿಕ್ಸ್‌ಗಳನ್ನು ಅನ್ವಯಿಸಿ. ನೈಜ ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಬದಲಾವಣೆ ಆಗುವುದಿಲ್ಲ.',upload:'ಸನ್ನಿವೇಶಗಳ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ JSON ಅಪ್‌ಲೋಡ್ ಆಯ್ಕೆ ಮಾಡಿ. ಸೂಚಿಸಿದ ಮಾದರಿಯ ಮತ್ತು ಗಾತ್ರದ ಕಲ್ಪಿತ ಫೈಲ್ ಮಾತ್ರ ಬಳಸಿ. ನೈಜ ಪಾಸ್‌ವರ್ಡ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಬೇಡಿ.',risk:'ರಿಸ್ಕ್ ಸ್ಕೋರ್‌ಗಳು ಕಲ್ಪಿತ ಮಾಹಿತಿಗೆ ನೀಡಿರುವ ಅಂದಾಜುಗಳು. ಅನುಮತಿ ಮತ್ತು ದಾಳಿಯ ಮಾರ್ಗಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',scenario:'ಹೋಮ್‌ನಲ್ಲಿ ಆಸ್ಪತ್ರೆ, ಕಾಲೇಜು, ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಶಾಪಿಂಗ್ ಆಯ್ಕೆ ಮಾಡಿ. ವಿಶ್ಲೇಷಣೆ ಒತ್ತಿದರೆ ಸಂಭಾವ್ಯ ದಾಳಿಯ ಮಾರ್ಗಗಳು ಕಾಣುತ್ತವೆ.',report:'ವರದಿಗಳ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ ಭದ್ರತಾ ಫಲಿತಾಂಶ ನೋಡಿ, ಟೆಕ್ಸ್ಟ್ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',unknown:'ಸನ್ನಿವೇಶಗಳು, ಅಟ್ಯಾಕ್ ಪಾತ್, ಬ್ಲಾಸ್ಟ್ ರೇಡಿಯಸ್, ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಭದ್ರತಾ ಪರಿಹಾರಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.',say:'ಈ ಭಾಷೆಯಲ್ಲಿ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ. ಉತ್ತರ ಬರಹದಲ್ಲಿ ಕಾಣುತ್ತದೆ.',lang:'ವೆಬ್‌ಸೈಟ್ ಭಾಷೆ',home:'ಹೋಮ್',dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',employees:'ಉದ್ಯೋಗಿಗಳು',analysis:'ವಿಶ್ಲೇಷಣೆ',remediation:'ಪರಿಹಾರಗಳು',scenarios:'ಸನ್ನಿವೇಶಗಳು',reports:'ವರದಿಗಳು',back:'← ಹೋಮ್‌ಗೆ ಹಿಂದಿರುಗಿ',welcome:'ಭದ್ರತಾ ಸನ್ನಿವೇಶಗಳು',security:'ಭದ್ರತಾ ಅವಲೋಕನ'},
      hi:{hello:'नमस्ते! मैं पायजेनिक आर्क का वॉइस गाइड हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',name:'वॉइस गाइड',help:'मैं आपकी कैसे मदद करूँ?',listen:'बोलें',send:'भेजें',speak:'सुनाएँ',close:'बंद करें',stop:'आवाज़ बंद',hint:'वेबसाइट के बारे में टाइप करें या बोलें।',micro:'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया टाइप करें।',denied:'माइक्रोफ़ोन शुरू नहीं हो सका। अनुमति जाँचें या टाइप करें।',failed:'माफ़ कीजिए, समझ नहीं आया। दोबारा कोशिश करें।',nav:'ऊपर मेनू से सेक्शन चुनें। अस्पताल, कॉलेज, बैंकिंग या शॉपिंग चुनकर Analyze Scenario दबाएँ।',about:'पायजेनिक आर्क एक शैक्षिक क्लाउड सुरक्षा प्रोजेक्ट है। यह काल्पनिक डेटा से गलत अनुमतियों के कारण महत्वपूर्ण जानकारी तक पहुँच के रास्ते दिखाता है।',path:'अटैक पाथ वह संभावित रास्ता है जो किसी खुले एंट्री पॉइंट से महत्वपूर्ण डेटाबेस तक पहुँच सकता है।',blast:'ब्लास्ट रेडियस का मतलब है इस मॉडल में संभावित रूप से पहुँच में आने वाले संसाधनों की संख्या।',fix:'Remediation सेक्शन खोलें। सुझाए गए फ़िक्स चुनें और Apply Simulated Fixes दबाएँ। असली क्लाउड में कोई बदलाव नहीं होता।',upload:'Scenarios में JSON फ़ाइल अपलोड करें। दिखाए गए फ़ॉर्मेट और साइज़ का काल्पनिक डेटा ही डालें। असली पासवर्ड अपलोड न करें।',risk:'ये जोखिम स्कोर काल्पनिक डेटा के अनुमान हैं। सुधार से पहले अटैक पाथ और अनुमतियाँ देखें।',scenario:'होम से अस्पताल, कॉलेज, बैंकिंग या शॉपिंग चुनें और Analyze Scenario दबाएँ।',report:'Reports सेक्शन में सुरक्षा परिणाम देखें और टेक्स्ट रिपोर्ट डाउनलोड करें।',unknown:'आप मुझसे अटैक पाथ, ब्लास्ट रेडियस, फ़ाइल अपलोड, जोखिम या सुरक्षा सुधार के बारे में पूछ सकते हैं।',say:'इस भाषा की आवाज़ आपके ब्राउज़र में उपलब्ध नहीं है। जवाब स्क्रीन पर है।',lang:'वेबसाइट भाषा',home:'होम',dashboard:'डैशबोर्ड',employees:'कर्मचारी',analysis:'विश्लेषण',remediation:'सुधार',scenarios:'परिदृश्य',reports:'रिपोर्ट',back:'← होम पर वापस',welcome:'सुरक्षा परिदृश्य',security:'सुरक्षा का सारांश'},
      ta:{hello:'வணக்கம்! நான் பைஜெனிக் ஆர்க் குரல் வழிகாட்டி. எப்படி உதவலாம்?',name:'குரல் வழிகாட்டி',help:'எப்படி உதவலாம்?',listen:'பேசுங்கள்',send:'அனுப்பு',speak:'வாசிக்கவும்',close:'மூடு',stop:'குரலை நிறுத்து',hint:'இந்த இணையதளம் பற்றி தட்டச்சு செய்யவும் அல்லது பேசவும்.',micro:'இந்த உலாவியில் குரல் உள்ளீடு இல்லை. தயவுசெய்து தட்டச்சு செய்யவும்.',denied:'மைக்ரோஃபோன் தொடங்கவில்லை. அனுமதியைச் சரிபார்க்கவும்.',failed:'மன்னிக்கவும், புரியவில்லை. மீண்டும் முயற்சிக்கவும்.',nav:'மேலே உள்ள மெனுவில் பிரிவைத் தேர்ந்தெடுக்கவும். ஒரு சூழலைத் தேர்ந்தெடுத்து Analyze Scenario அழுத்தவும்.',about:'பைஜெனிக் ஆர்க் ஒரு கல்வி நோக்கமுள்ள கிளவுட் பாதுகாப்பு திட்டம். கற்பனை தரவின் மூலம் அபாயகரமான அணுகல் வழிகளைக் காட்டுகிறது.',path:'அட்டாக் பாத் என்பது வெளிப்படையான நுழைவிடத்திலிருந்து முக்கிய தரவை அடையும் சாத்தியமான வழியாகும்.',blast:'பிளாஸ்ட் ரேடியஸ் என்பது இந்த மாதிரியில் பாதிக்கப்படக்கூடிய வளங்களின் எண்ணிக்கையாகும்.',fix:'Remediation பகுதியைத் திறந்து பரிந்துரைக்கப்பட்ட தீர்வுகளைத் தேர்ந்தெடுத்து Apply Simulated Fixes அழுத்தவும். உண்மையான அமைப்புகள் மாறாது.',upload:'Scenarios பகுதியில் சரியான வடிவமும் அளவும் கொண்ட கற்பனை JSON கோப்பைப் பதிவேற்றவும். உண்மையான கடவுச்சொற்களை பதிவேற்ற வேண்டாம்.',risk:'ஆபத்து மதிப்பெண்கள் கற்பனைத் தரவிற்கான மதிப்பீடுகள். அணுகல் பாதைகளைச் சரிபார்க்கவும்.',scenario:'முகப்பில் மருத்துவமனை, கல்லூரி, வங்கி அல்லது ஷாப்பிங் தேர்வு செய்து Analyze Scenario அழுத்தவும்.',report:'Reports பகுதியில் பாதுகாப்பு முடிவுகளைப் பார்த்து அறிக்கையைப் பதிவிறக்கவும்.',unknown:'சூழல்கள், அட்டாக் பாத், பிளாஸ்ட் ரேடியஸ், பதிவேற்றம் மற்றும் பாதுகாப்பு தீர்வுகள் பற்றி கேளுங்கள்.',say:'இந்த மொழிக்கான குரல் கிடைக்கவில்லை. பதில் எழுத்தில் உள்ளது.',lang:'இணையதள மொழி',home:'முகப்பு',dashboard:'டாஷ்போர்டு',employees:'ஊழியர்கள்',analysis:'பகுப்பாய்வு',remediation:'தீர்வுகள்',scenarios:'சூழல்கள்',reports:'அறிக்கைகள்',back:'← முகப்புக்கு',welcome:'பாதுகாப்பு சூழல்கள்',security:'பாதுகாப்பு சுருக்கம்'},
      te:{hello:'నమస్కారం! నేను పైజెనిక్ ఆర్క్ వాయిస్ గైడ్. మీకు ఎలా సహాయం చేయగలను?',name:'వాయిస్ గైడ్',help:'మీకు ఎలా సహాయం చేయాలి?',listen:'మాట్లాడండి',send:'పంపండి',speak:'చదివి వినిపించు',close:'మూసివేయండి',stop:'వాయిస్ ఆపు',hint:'వెబ్‌సైట్ గురించి టైప్ చేయండి లేదా మాట్లాడండి.',micro:'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.',denied:'మైక్రోఫోన్ ప్రారంభం కాలేదు. అనుమతి పరిశీలించండి.',failed:'క్షమించండి, అర్థం కాలేదు. మళ్లీ ప్రయత్నించండి.',nav:'పైన మెనూలో విభాగాన్ని ఎంచుకోండి. ఒక సన్నివేశాన్ని ఎంచుకుని Analyze Scenario నొక్కండి.',about:'పైజెనిక్ ఆర్క్ ఒక విద్యా ప్రయోజనాల క్లౌడ్ భద్రతా ప్రాజెక్టు. కల్పిత డేటాతో ప్రమాదకరమైన యాక్సెస్ మార్గాలను చూపిస్తుంది.',path:'అటాక్ పాత్ అంటే బహిర్గతమైన ప్రవేశ స్థానం నుంచి ముఖ్యమైన డేటా వరకు చేరే సాధ్యమైన మార్గం.',blast:'బ్లాస్ట్ రేడియస్ అంటే ఈ నమూనాలో ప్రభావితం కావచ్చిన వనరుల సంఖ్య.',fix:'Remediation విభాగంలో సూచించిన పరిష్కారాలను ఎంచుకుని Apply Simulated Fixes నొక్కండి. నిజమైన క్లౌడ్‌లో మార్పులుండవు.',upload:'Scenarios లో సరైన ఫార్మాట్, పరిమాణం గల కల్పిత JSON ఫైల్‌ను అప్‌లోడ్ చేయండి. నిజమైన పాస్‌వర్డ్‌లను అప్‌లోడ్ చేయవద్దు.',risk:'రిస్క్ స్కోర్లు కల్పిత డేటాకు సంబంధించిన అంచనాలు. యాక్సెస్ మార్గాలను పరిశీలించండి.',scenario:'హోమ్‌లో హాస్పిటల్, కాలేజ్, బ్యాంకింగ్ లేదా షాపింగ్ ఎంచుకుని Analyze Scenario నొక్కండి.',report:'Reports లో ఫలితాలు చూసి నివేదిక డౌన్‌లోడ్ చేయండి.',unknown:'అటాక్ పాత్, బ్లాస్ట్ రేడియస్, ఫైల్ అప్‌లోడ్ లేదా భద్రతా పరిష్కారాల గురించి అడగవచ్చు.',say:'ఈ భాషకు వాయిస్ అందుబాటులో లేదు. సమాధానం స్క్రీన్‌పై ఉంది.',lang:'వెబ్‌సైట్ భాష',home:'హోమ్',dashboard:'డాష్‌బోర్డ్',employees:'ఉద్యోగులు',analysis:'విశ్లేషణ',remediation:'పరిష్కారాలు',scenarios:'సన్నివేశాలు',reports:'నివేదికలు',back:'← హోమ్‌కు తిరిగి',welcome:'భద్రతా సన్నివేశాలు',security:'భద్రతా అవలోకనం'},
      ml:{hello:'നമസ്കാരം! ഞാൻ പൈജെനിക് ആർക്ക് വോയ്സ് ഗൈഡാണ്. എങ്ങനെ സഹായിക്കാം?',name:'വോയ്സ് ഗൈഡ്',help:'എങ്ങനെ സഹായിക്കാം?',listen:'സംസാരിക്കുക',send:'അയയ്ക്കുക',speak:'വായിച്ചു കേൾപ്പിക്കുക',close:'അടയ്ക്കുക',stop:'ശബ്ദം നിർത്തുക',hint:'വെബ്സൈറ്റിനെക്കുറിച്ച് ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക.',micro:'ഈ ബ്രൗസറിൽ ശബ്ദ ഇൻപുട്ട് ലഭ്യമല്ല. ദയവായി ടൈപ്പ് ചെയ്യുക.',denied:'മൈക്രോഫോൺ പ്രവർത്തിച്ചില്ല. അനുമതി പരിശോധിക്കുക.',failed:'ക്ഷമിക്കണം, മനസ്സിലായില്ല. വീണ്ടും ശ്രമിക്കുക.',nav:'മുകളിലെ മെനുവിൽ ഒരു വിഭാഗം തിരഞ്ഞെടുക്കുക. ഒരു സാഹചര്യം തിരഞ്ഞെടുത്ത് Analyze Scenario അമർത്തുക.',about:'പൈജെനിക് ആർക്ക് ഒരു വിദ്യാഭ്യാസ ക്ലൗഡ് സുരക്ഷാ പദ്ധതിയാണ്. സാങ്കൽപ്പിക ഡാറ്റ ഉപയോഗിച്ച് അപകടസാധ്യതയുള്ള പ്രവേശന വഴികൾ കാണിക്കുന്നു.',path:'അറ്റാക്ക് പാത്ത് എന്നത് തുറന്ന പ്രവേശന സ്ഥാനത്തു നിന്ന് പ്രധാനപ്പെട്ട ഡാറ്റയിലേക്കുള്ള സാധ്യമായ വഴിയാണ്.',blast:'ബ്ലാസ്റ്റ് റേഡിയസ് എന്നാൽ ഈ മാതൃകയിൽ ബാധിക്കാവുന്ന വിഭവങ്ങളുടെ എണ്ണമാണ്.',fix:'Remediation തുറന്ന് ശുപാർശ ചെയ്ത പരിഹാരങ്ങൾ തിരഞ്ഞെടുത്ത് Apply Simulated Fixes അമർത്തുക. യഥാർത്ഥ സംവിധാനങ്ങളിൽ മാറ്റമില്ല.',upload:'Scenarios ഭാഗത്ത് ശരിയായ ഫോർമാറ്റിലുള്ള സാങ്കൽപ്പിക JSON ഫയൽ അപ്‌ലോഡ് ചെയ്യുക. യഥാർത്ഥ പാസ്‌വേഡുകൾ അപ്‌ലോഡ് ചെയ്യരുത്.',risk:'റിസ്ക് സ്കോറുകൾ സാങ്കൽപ്പിക ഡാറ്റയെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്. പ്രവേശന വഴികൾ പരിശോധിക്കുക.',scenario:'ഹോമിൽ ആശുപത്രി, കോളേജ്, ബാങ്കിംഗ് അല്ലെങ്കിൽ ഷോപ്പിംഗ് തിരഞ്ഞെടുത്ത് Analyze Scenario അമർത്തുക.',report:'Reports ഭാഗത്ത് ഫലങ്ങൾ പരിശോധിച്ച് റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക.',unknown:'സാഹചര്യങ്ങൾ, അറ്റാക്ക് പാത്ത്, ബ്ലാസ്റ്റ് റേഡിയസ്, ഫയൽ അപ്‌ലോഡ്, സുരക്ഷാ പരിഹാരങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ.',say:'ഈ ഭാഷയ്ക്കുള്ള ശബ്ദം ലഭ്യമല്ല. ഉത്തരം സ്ക്രീനിലുണ്ട്.',lang:'വെബ്സൈറ്റ് ഭാഷ',home:'ഹോം',dashboard:'ഡാഷ്ബോർഡ്',employees:'ജീവനക്കാർ',analysis:'വിശകലനം',remediation:'പരിഹാരം',scenarios:'സാഹചര്യങ്ങൾ',reports:'റിപ്പോർട്ടുകൾ',back:'← ഹോമിലേക്ക്',welcome:'സുരക്ഷാ സാഹചര്യങ്ങൾ',security:'സുരക്ഷാ അവലോകനം'}
    };
    let lang='en'; try { const stored=localStorage.getItem('pygenic-voice-language'); if(locales[stored]) lang=stored; }catch{}
    const css=document.createElement('style'); css.textContent=`
      #pvoice-toolbar{position:fixed;top:85px;right:18px;z-index:800;border:1px solid #3d8fa7;background:#091c30;color:#d7eefc;border-radius:9px;padding:5px 9px;font:13px system-ui}
      #pvoice-toolbar select{background:#091c30;color:#fff;border:0;padding:7px;max-width:140px}
      #pvoice-launch{position:fixed;right:22px;bottom:22px;z-index:998;background:#03b9dc;color:#041827;border:2px solid #80eaff;border-radius:40px;box-shadow:0 0 20px #00cbe06b;padding:13px 17px;font:700 14px system-ui;cursor:pointer}
      #pvoice-chat{position:fixed;z-index:999;right:20px;bottom:82px;width:min(370px,calc(100vw - 25px));max-height:min(590px,80vh);display:flex;flex-direction:column;border:1px solid #3e7b99;background:#071a2e;color:#eff8ff;box-shadow:0 14px 36px #000b;border-radius:14px;overflow:hidden;font:14px system-ui}
      #pvoice-chat[hidden]{display:none!important}
      #pvoice-chat header{background:#0d3147;display:flex;align-items:center;justify-content:space-between;padding:13px;border:0;text-align:left}
      #pvoice-chat header strong{color:#9af4ff;font-size:16px}
      #pvoice-chat button{font:600 13px system-ui;background:#116080;border:1px solid #2d96b2;color:#f4fdff;padding:9px;border-radius:7px;cursor:pointer;margin:2px}
      #pvoice-chat button:hover{background:#217da2;color:#fff}
      #pvoice-messages{overflow:auto;min-height:120px;max-height:260px;padding:14px;display:flex;flex-direction:column;gap:10px}
      .pvoice-bubble{max-width:96%;border-radius:9px;padding:9px 11px;white-space:pre-wrap;line-height:1.45;background:#12314b;color:#e5f8ff}
      .pvoice-me{align-self:flex-end;background:#1a5365}
      #pvoice-quick{padding:6px 12px;display:flex;flex-wrap:wrap;gap:3px}
      #pvoice-controls{display:flex;align-items:stretch;padding:9px;border-top:1px solid #29506b;gap:3px}
      #pvoice-input{flex:1;min-width:0;padding:10px;background:#04162b;border:1px solid #37718e;border-radius:7px;color:#fff;font-size:14px}
      #pvoice-status{min-height:20px;color:#c5d9ed;font-size:12px;margin:0 12px 8px}
      @media(max-width:650px){#pvoice-toolbar{top:auto;bottom:78px;right:18px}#pvoice-chat{bottom:130px;max-height:65vh}}
    `; document.head.appendChild(css);
    const toolbar=document.createElement('label');toolbar.id='pvoice-toolbar';toolbar.innerHTML=`<span id="pvoice-lang-title"></span> <select id="pvoice-lang" aria-label="Website and voice guide language"></select>`;document.body.appendChild(toolbar);
    const selector=toolbar.querySelector('select'); Object.keys(locales).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=languageNames[k];selector.appendChild(o)});selector.value=lang;
    const launch=document.createElement('button');launch.id='pvoice-launch';launch.type='button';launch.textContent='🎙️ Voice Guide';document.body.appendChild(launch);
    const chat=document.createElement('section');chat.id='pvoice-chat';chat.hidden=true;chat.setAttribute('aria-label','Voice website assistant');
    chat.innerHTML=`<header><strong id="pvoice-title"></strong><button id="pvoice-close" type="button" aria-label="Close">×</button></header>
      <div id="pvoice-messages" role="log" aria-live="polite"></div><div id="pvoice-quick"></div>
      <div id="pvoice-controls"><input id="pvoice-input" type="text" aria-label="Ask a question" maxlength="350" />
        <button id="pvoice-mic" type="button" aria-label="Speak">🎤</button><button id="pvoice-send" type="button">➤</button><button id="pvoice-read" type="button" aria-label="Read last answer">🔊</button><button id="pvoice-stop" type="button" aria-label="Stop speech">■</button></div><p id="pvoice-status" role="status"></p>`;
    document.body.appendChild(chat);
    const $=id=>document.getElementById(id);let lastAnswer='', recognition=null;
    function setStatus(v){$('pvoice-status').textContent=v||''}
    function add(text,isMe=false){const e=document.createElement('div');e.className='pvoice-bubble'+(isMe?' pvoice-me':'');e.textContent=text;$('pvoice-messages').appendChild(e);$('pvoice-messages').scrollTop=$('pvoice-messages').scrollHeight}
    function speak(text){
      if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){setStatus(d[lang].say);return}
      window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=locales[lang];u.rate=.94;
      const voices=window.speechSynthesis.getVoices();const code=locales[lang].split('-')[0].toLowerCase();const voice=voices.find(v=>v.lang.toLowerCase()===locales[lang].toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(code));
      if(voice)u.voice=voice;else if(lang!=='en')setStatus(d[lang].say);
      window.speechSynthesis.speak(u);
    }
    const keyword={
      about:/pygenic|about|website|project|ಏನು|ಬಗ್ಗೆ|वेबसाइट|प्रोजेक्ट|திட்டம்|వెబ్|പ്രോജക്ട്/i,
      path:/attack\s*path|path|route|ಪಾತ್|ಮಾರ್ಗ|पाथ|रास्ता|பாத்|మార్గం|പാത്ത്/i,
      blast:/blast|radius|ಬ್ಲಾಸ್ಟ್|रेडियस|ரேடியஸ்|రేడియస్|റേഡിയസ്/i,
      fix:/remediat|fix|repair|solve|solution|ಪರಿಹಾರ|ಸರಿಪಡ|फिक्स|सुधार|தீர்வு|పరిష్కారం|പരിഹാരം/i,
      upload:/upload|json|file|ಅಪ್‌ಲೋಡ್|ಫೈಲ್|अपलोड|फ़ाइल|கோப்பு|அப்லோட்|ఫైల్|అప్‌లోడ్|ഫയൽ|അപ്‌ലോഡ്/i,
      risk:/risk|severity|score|ರಿಸ್ಕ್|ಅಪಾಯ|जोखिम|रिस्क|ஆபத்து|రిస్క్|റിസ്ക്/i,
      scenario:/hospital|college|bank|shopping|scenario|ಆಸ್ಪತ್ರೆ|ಕಾಲೇಜು|ಬ್ಯಾಂಕ್|ಅಂಗಡಿ|अस्पताल|कॉलेज|बैंक|மருத்துவமனை|கல்லூரி|బ్యాంక్|ഹോസ്പിറ്റൽ/i,
      report:/report|download|ವರದಿ|डाउनलोड|रिपोर्ट|அறிக்கை|రిపోర్ట్|റിപ്പോർട്ട്/i,
      nav:/how|use|help|start|guide|navigate|ಏಗೆ|ಹೇಗೆ|ಬಳಸ|कैसे|मदद|எப்படி|உதவி|ఎలా|സഹായം|എങ്ങനെ/i
    };
    function getAnswer(question){const q=question.toLowerCase();for(const [key,re] of Object.entries(keyword)){if(re.test(q))return d[lang][key]}return d[lang].unknown}
    async function ask(question){
      const text=question.trim();if(!text)return;
      add(text,true);$('pvoice-input').value='';
      // Only use the optional server model when it is actually configured.
      // Otherwise preserve the original multilingual offline voice guide.
      let answer=null;
      if(location.protocol!=='file:'){
        try{
          const status=await fetch('/api/status',{signal:AbortSignal.timeout(3000)});
          if(status.ok&&(await status.json()).aiConnected){
            setStatus('Analyzing with connected AI model…');
            const context=window.PygenicInvestigator?.getContext();
            const response=await fetch('/api/agent',{
              method:'POST',headers:{'Content-Type':'application/json'},
              body:JSON.stringify({question:text,language:lang,model:context?.model,fixes:context?.fixes||[]}),
              signal:AbortSignal.timeout(45000)
            });
            if(response.ok){const result=await response.json();if(result.mode==='model-agent')answer=result.answer;}
          }
        }catch{ /* Offline FAQ remains available in all supported locales. */ }
      }
      lastAnswer=answer||getAnswer(text);
      setStatus(answer?'Connected AI answer · synthetic project data only':'Local multilingual website guide · no live AI');
      add(lastAnswer);speak(lastAnswer);
    }
    const quick=[['about','?'],['nav','?'],['path','?'],['fix','?']];
    function translate(){
      const t=d[lang];document.documentElement.lang=locales[lang];$('pvoice-lang-title').textContent=t.lang;
      $('pvoice-title').textContent='🎙️ PYGENIC ARC · '+t.name;launch.textContent='🎙️ '+t.name;
      $('pvoice-input').placeholder=t.hint;$('pvoice-mic').title=t.listen;$('pvoice-send').title=t.send;$('pvoice-read').title=t.speak;$('pvoice-stop').title=t.stop;$('pvoice-close').title=t.close;
      const nav=document.querySelectorAll('#arc4nav [data-view]');nav.forEach(b=>{const k=b.dataset.view;if(t[k])b.textContent=t[k]});
      const back=document.querySelector('.arc4-back');if(back)back.textContent=t.back;
      const heading=document.querySelector('#arc4heading h1');if(heading){const id=document.querySelector('#arc4nav [aria-current="page"]')?.dataset.view;if(id&&t[id])heading.textContent=t[id]}
      const mainTitles=document.querySelectorAll('#arc4home .arc4-panel h2');if(mainTitles[0])mainTitles[0].textContent=t.welcome;if(mainTitles[1])mainTitles[1].textContent=t.security;
      const q=$('pvoice-quick');q.replaceChildren();quick.forEach(([key])=>{const b=document.createElement('button');b.type='button';b.textContent=key==='about'?'ⓘ':key==='nav'?'➤':key==='path'?'↗':'🛡';b.title=d[lang][key];b.addEventListener('click',()=>{lastAnswer=d[lang][key];add(lastAnswer);speak(lastAnswer)});q.appendChild(b)});
    }
    let translating=false;
    selector.addEventListener('change',()=>{lang=selector.value;try{localStorage.setItem('pygenic-voice-language',lang)}catch{};window.speechSynthesis?.cancel();setStatus('');translate();lastAnswer=d[lang].hello;add(lastAnswer);speak(lastAnswer)});
    launch.addEventListener('click',()=>{chat.hidden=!chat.hidden; if(!chat.hidden){ if(!$('pvoice-messages').children.length){lastAnswer=d[lang].hello;add(lastAnswer);speak(lastAnswer)}$('pvoice-input').focus()}else window.speechSynthesis?.cancel()});
    $('pvoice-close').addEventListener('click',()=>{chat.hidden=true;window.speechSynthesis?.cancel();recognition?.stop()});
    $('pvoice-send').addEventListener('click',()=>ask($('pvoice-input').value));
    $('pvoice-input').addEventListener('keydown',e=>{if(e.key==='Enter')ask(e.target.value)});
    $('pvoice-read').addEventListener('click',()=>speak(lastAnswer||d[lang].hello));
    $('pvoice-stop').addEventListener('click',()=>{window.speechSynthesis?.cancel();setStatus('')});
    $('pvoice-mic').addEventListener('click',()=>{
      if(!SpeechRec){setStatus(d[lang].micro);return}
      if(recognition){recognition.stop();recognition=null;return}
      try{
        recognition=new SpeechRec();recognition.lang=locales[lang];recognition.interimResults=false;recognition.maxAlternatives=1;
        recognition.onresult=e=>{const transcript=e.results[0][0].transcript;recognition=null;setStatus('');ask(transcript)};
        recognition.onerror=()=>{setStatus(d[lang].denied);recognition=null};
        recognition.onend=()=>{recognition=null};
        setStatus('🎙️ '+d[lang].listen);recognition.start();
      }catch{recognition=null;setStatus(d[lang].denied)}
    });
    document.addEventListener('click',e=>{if(e.target.closest('#arc4nav [data-view], .arc4-back'))setTimeout(translate,0)},true);
    translate();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
