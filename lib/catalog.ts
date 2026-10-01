export type Source = {
    id: string;
    name: string;
    title: string;
    url: string;
    region: string;
    status: "retrieved" | "search-confirmed" | "needs-recheck";
    checked: string;
    kind: string;
};
const source = (id: string, name: string, title: string, url: string, region = "Global", status: Source["status"] = "retrieved", kind = "Official guidance"): Source => ({ id, name, title, url, region, status, checked: "2026-10-01", kind });
export const sources: Source[] = [
    source("uk-fraud","Report Fraud","Report cybercrime or fraud in England, Wales, or Northern Ireland","https://www.reportfraud.police.uk/reporting-a-fraud/","United Kingdom","search-confirmed"),
    source("india-helpline","I4C","Financial cyber-fraud reporting helpline","https://www.cybercrime.gov.in/Webform/cyber_suspect.aspx","India","search-confirmed"),
    source("lost-windows", "Microsoft", "Find and lock a lost Windows device", "https://support.microsoft.com/en-us/accounts-billing/security/find-and-lock-a-lost-windows-device", "Global", "search-confirmed"),
    source("lost-mac", "Apple", "If your Mac is lost or stolen", "https://support.apple.com/en-ae/102481", "Global", "search-confirmed"),
    source("google", "Google", "Secure a compromised Google Account", "https://support.google.com/accounts/answer/6294825"),
    source("microsoft", "Microsoft", "Recover a compromised Microsoft account", "https://support.microsoft.com/en-us/accounts-billing/manage/how-to-recover-a-hacked-or-compromised-microsoft-account"),
    source("apple", "Apple", "Secure your Apple Account", "https://support.apple.com/en-us/102560"),
    source("ncsc", "UK NCSC", "Recovering a hacked account", "https://www.ncsc.gov.uk/guidance/recovering-a-hacked-account", "United Kingdom"),
    source("ftc-account", "FTC", "Recover email and social media accounts", "https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account", "United States"),
    source("mfa", "Google", "Fix issues with 2-Step Verification", "https://support.google.com/accounts/answer/185834"),
    source("forward", "Google", "Gmail forwarding settings", "https://support.google.com/mail/answer/10957", "Global", "search-confirmed"),
    source("phishing", "FTC", "Recognize and avoid phishing", "https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams", "United States", "search-confirmed"),
    source("scam", "FTC", "What to do if you were scammed", "https://consumer.ftc.gov/articles/what-do-if-you-were-scammed", "United States"),
    source("india", "I4C", "National Cybercrime Reporting Portal", "https://www.cybercrime.gov.in/", "India", "needs-recheck"),
    source("identity", "FTC", "Identity theft recovery steps", "https://www.identitytheft.gov/Steps", "United States"),
    source("breach", "FTC", "IdentityTheft.gov", "https://www.identitytheft.gov/", "United States"),
    source("iphone", "Apple", "If your iPhone or iPad was stolen", "https://support.apple.com/en-ie/120837", "Global", "search-confirmed"),
    source("android", "Google", "Find, secure, or erase a lost Android device", "https://support.google.com/android/answer/6160491?hl=en", "Global", "search-confirmed"),
    source("sim", "FTC", "SIM swap scams", "https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself", "United States"),
    source("malware", "Australian ACSC", "Report and recover from malware", "https://www.cyber.gov.au/report-and-recover/recover-from/malware", "Australia"),
    source("ransom", "CISA", "StopRansomware guide", "https://www.cisa.gov/stopransomware/ransomware-guide", "United States"),
    source("decrypt", "No More Ransom", "Ransomware decryption resources", "https://www.nomoreransom.org/en/decryption-tools.html", "Global", "retrieved", "Specialist resource"),
    source("chrome", "Google", "Unwanted ads, pop-ups and malware", "https://support.google.com/chrome/answer/2765944"),
    source("drive", "Google", "Stop, limit or change file sharing", "https://support.google.com/drive/answer/2494893?hl=en-GB"),
    source("safety", "Safety Net Project", "Technology safety planning", "https://www.techsafety.org/resources-survivors/technology-safety-plan", "Global", "retrieved", "Specialist nonprofit"),
    source("stalker", "Coalition Against Stalkerware", "Information for survivors", "https://stopstalkerware.org/information-for-survivors/", "Global", "retrieved", "Specialist nonprofit"),
    source("ncii", "StopNCII", "Intimate-image abuse support", "https://stopncii.org/", "Global", "retrieved", "Specialist nonprofit"),
    source("ncmec", "NCMEC", "Take It Down", "https://takeitdown.ncmec.org/", "Global", "retrieved", "Specialist nonprofit"),
    source("github", "GitHub", "Removing exposed repository secrets", "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository"),
    source("australia", "Australian ACSC", "Report and recover", "https://www.cyber.gov.au/report-and-recover", "Australia"),
];
export const categories = [{ id: "accounts", name: "Accounts & access" }, { id: "phishing", name: "Phishing & scams" }, { id: "money", name: "Money & identity" }, { id: "devices", name: "Lost devices" }, { id: "malware", name: "Malware & browsers" }, { id: "safety", name: "Privacy & safety" }, { id: "work", name: "Work & developers" }];
export type Step = {
    id: string;
    title: string;
    body: string;
    check: string;
    fallback: string;
    sourceId: string;
    phase: "Do now" | "Do next" | "Follow up" | "Prevent recurrence";
    when?: string;
    warning?: string;
};
export type Guide = {
    id: string;
    title: string;
    description: string;
    category: string;
    platform: string;
    device: string;
    minutes: number;
    tags: string[];
    sourceIds: string[];
    steps: Step[];
    fit: string;
    version: number;
    access: string;
    money: boolean;
    region: string;
    level: string;
    review: string;
};
type Entry = [
    string,
    string,
    string,
    string,
    string,
    string,
    number,
    string,
    string[],
    [
        string,
        string,
        string?,
        string?
    ][]
];
const entries: Entry[] = [
    ["not-sure", "Not sure what happened? Start here.", "Separate what you observed from what you suspect, then find a sensible next step.", "accounts", "Any service", "Any device", 10, "Something feels unusual, but you have not confirmed unauthorized activity.", ["phishing", "google", "australia"], [
            ["Pause and note what you observed", "Write down the message, change, or symptom without including secret values. An unfamiliar alert alone does not prove a break-in.", "You can describe the change without assuming its cause."],
            ["Check through a known route", "Open the service's official app or website independently. Look at its security activity or help center; avoid links in unexpected messages.", "You checked the alert through a route you trust."],
            ["Choose the matching next step", "Use the recovery library for account changes, payments, device loss, or software you installed. If money is at risk, contact the payment provider immediately.", "You have chosen guidance matching an actual action or observation."],
            ["Ask for help if it remains unclear", "Contact the provider using its official help center. Share a short, redacted description if you ask the community.", "Your question explains what happened without exposing private details."]
        ]],
    ["lost-computer", "Protect a missing laptop or other device", "Find the provider's loss controls and protect accounts you used on the device.", "devices", "Any service", "Computer", 15, "Your Windows PC, Mac, or another device is missing.", ["lost-windows", "lost-mac", "ncsc"], [
            ["Choose the matching official loss guide", "Use the Microsoft or Apple source below for your computer. Other devices need their manufacturer's official support. Locate and lock features require supported settings to have been enabled.", "You know whether your device supports an available loss control."],
            ["Review locate and lock options", "Follow the provider's instructions from a device you trust. Do not confront someone or travel to an unfamiliar location based on a tracking result.", "You have used the supported lock option, or know why it is unavailable."],
            ["Protect accounts and report the loss", "Use the account providers' security controls to review sessions and affected credentials. Tell your workplace about a managed device and use local reporting channels for theft.", "The relevant provider or workplace knows about the loss."],
            ["Consider erasure carefully", "Read the manufacturer's consequences and backup requirements before choosing a remote erase. RECLAIM cannot locate or erase a device for you.", "You understand the consequences before making an irreversible choice."]
        ]],
    ["google-account", "Recover your Google account", "Secure your email and regain control after unfamiliar activity.", "accounts", "Google", "Any device", 15, "You noticed unauthorized activity or someone changed your Google password.", ["google"], [
            ["Recover access if you’re locked out", "Use the recovery link inside Google’s official guide. Answer ownership questions there, never in a community post.", "You can sign in, or Google has provided a next step.", "locked"],
            ["Review your account activity", "Open Google Account → Security & sign-in. Review recent events and devices you don’t recognize.", "Unfamiliar events have been reviewed.", "signed-in"],
            ["Restore your security settings", "Change an exposed password and correct unfamiliar recovery information. Use a trusted device.", "Your recovery details belong to you."],
            ["Review connected access", "Inspect connected services and Gmail forwarding. Remove access you did not authorize.", "Unwanted connections have been removed."],
            ["Strengthen sign-in", "Set up a supported second factor and safely keep recovery options.", "You have a working backup sign-in method."]
        ]],
    ["microsoft-account", "Recover your Microsoft account", "Work through Outlook, Xbox, and Microsoft account access problems.", "accounts", "Microsoft", "Any device", 20, "Your personal Microsoft account shows unauthorized activity.", ["microsoft"], [
            ["Start on a trustworthy device", "If your PC may be infected, update security software and complete a full scan before changing credentials.", "A trustworthy device is available."],
            ["Use the official sign-in helper", "Follow Microsoft’s recovery guide and its sign-in helper for your situation.", "The helper identifies your next recovery action."],
            ["Reset the affected password", "Change or reset your password using Microsoft’s own account flow.", "A new unique password is in use."],
            ["Inspect your account settings", "Check connected accounts, mail forwarding, and automatic replies for unauthorized changes.", "Unrecognized settings are corrected."]
        ]],
    ["apple-account", "Secure a compromised Apple Account", "Review trusted devices and restore control of your Apple Account.", "accounts", "Apple", "iPhone / Mac", 15, "Your Apple security details or activity changed without permission.", ["apple"], [
            ["Change or reset your password", "Use Apple’s official account controls. If locked out, follow the recovery link in the support guide.", "You have access or a recovery request."],
            ["Correct account information", "At Apple’s account website, review contact and security details.", "Only your information remains."],
            ["Review associated devices", "Identify and remove devices you do not recognize, after confirming they are not yours.", "Your device list is accounted for."],
            ["Secure recovery channels", "Check your email and mobile number are under your control; review two-factor authentication.", "Your recovery channels are usable."]
        ]],
    ["social-account", "Recover a hacked social account", "Find the legitimate recovery route for a social or messaging account.", "accounts", "Social media", "Any device", 20, "Messages or account changes appeared without your permission.", ["ftc-account"], [
            ["Choose the official recovery route", "The FTC guide links to providers including Facebook, Instagram, WhatsApp, and others. Use your provider’s instructions.", "You are on the provider’s actual domain."],
            ["Restore account control", "Follow the provider’s ownership checks. Nobody in this community can bypass them.", "Access is restored or the request is pending."],
            ["Review security and active sessions", "Replace exposed credentials, check account details, and review signed-in devices.", "Unwanted access has been addressed."],
            ["Let contacts know", "Prepare a brief warning that recent messages may not have been yours; send it through a channel you control.", "You have decided who needs to know."]
        ]],
    ["lost-mfa", "Lost your authenticator or security key?", "Find alternate sign-in methods without sharing backup codes.", "accounts", "Google", "Any device", 15, "You cannot use your usual second sign-in step.", ["mfa"], [
            ["Check another sign-in method", "Look for a previously configured backup code, key, passkey, or signed-in trusted device.", "You know which alternatives you have."],
            ["Follow account recovery if needed", "If no alternative works, open the provider’s recovery process. A work account may need its administrator.", "You have an official recovery route."],
            ["Replace the missing method", "Once signed in, remove a lost key or affected passkey and configure a replacement.", "The lost method no longer grants access."],
            ["Refresh backup options", "Generate replacement backup codes if old codes were exposed; store them somewhere private.", "Your backup option is safely stored."]
        ]],
    ["unexpected-mfa", "Unexpected sign-in or MFA requests", "Check whether a request is yours before approving it.", "accounts", "Any service", "Any device", 10, "A verification prompt arrived when you weren’t signing in.", ["apple", "google"], [
            ["Do not approve an unfamiliar request", "Open the real account app independently instead of using the message link.", "You have not shared or approved the code."],
            ["Inspect security activity", "Review recent account events. A prompt alone does not prove someone accessed the account.", "You know whether access was successful."],
            ["Respond to confirmed activity", "Use the provider’s compromised-account guide if you find unauthorized changes.", "You have chosen the appropriate account guide."]
        ]],
    ["mail-forwarding", "Check suspicious Gmail forwarding", "Investigate messages being redirected to another address.", "accounts", "Google", "Computer", 10, "You noticed a forwarding notice or mail behavior you didn’t configure.", ["forward"], [
            ["Open Gmail settings directly", "On a computer, open Gmail settings and the forwarding section using the official instructions.", "You can view your forwarding configuration."],
            ["Review forwarding and filters", "Inspect destinations and any filters that forward selected mail. Confirm legitimate rules before removal.", "You recognize the remaining rules."],
            ["Save the corrected settings", "Disable unauthorized forwarding and save. Work or school administrators may manage some settings.", "The unwanted destination is no longer active."],
            ["Review account security", "If another person changed these settings, continue with the Google account recovery guide.", "You have addressed how the change happened."]
        ]],
    ["connected-apps", "Review unfamiliar connected apps", "Understand which services can still reach your account.", "accounts", "Any service", "Any device", 10, "An app has access you no longer want or don’t recognize.", ["ncsc"], [
            ["Open the provider’s security settings", "Find connected apps and devices in the official account controls.", "You can see the authorized connections."],
            ["Check what each connection does", "Confirm unfamiliar names before removing access; a renamed service may be legitimate.", "You identified access that should end."],
            ["Revoke unwanted access", "Remove unnecessary connections and use the provider’s session sign-out controls if compromised.", "The unwanted connection is absent."],
            ["Recheck after recovery", "If access returns, revisit the device and recovery-email security paths.", "You know what to do if it recurs."]
        ]],
    ["suspicious-link", "Opened a suspicious link?", "Work out what was exposed before taking the next step.", "phishing", "Any service", "Any device", 5, "You opened a link but are unsure what happened next.", ["phishing"], [
            ["Stop interacting with the page", "Do not enter information, approve prompts, or open downloads. Close the suspicious page.", "The page is closed."],
            ["Check what happened", "Did you enter a password, share a code, grant access, or run a file? Choose the matching recovery path.", "You know which action needs attention."],
            ["Update and check your device", "If an attachment or harmful download may have run, use your device’s trusted security checks.", "You have checked for downloads or software."],
            ["Verify and report independently", "Use the organization’s known website or app to verify the message and find its reporting route.", "You used an independent contact route."]
        ]],
    ["exposed-password", "Entered a password on a fake page", "Prioritize the affected account and any reused credentials.", "phishing", "Any service", "Any device", 15, "You typed login details into a site you now suspect was fake.", ["scam"], [
            ["Open the genuine account site", "Use a trustworthy device and a known app or typed address.", "You are on the real provider’s site."],
            ["Change or recover the password", "Replace the affected password; if locked out, use the provider’s recovery flow.", "The exposed password is no longer current."],
            ["Address password reuse", "Change the same exposed password wherever else it was used.", "Other affected accounts use unique passwords."],
            ["Add a second sign-in factor", "Use a supported passkey or multifactor method and review recovery options.", "Your sign-in protection has been updated."]
        ]],
    ["remote-access", "Gave a stranger remote access", "Contain the access and get trusted help checking your computer.", "malware", "Any service", "Computer", 25, "An unexpected caller persuaded you to install or run remote support software.", ["malware"], [
            ["Disconnect the affected device", "End remote access and disconnect from the network if someone may still control it. Use a different device for help.", "The remote session is no longer connected."],
            ["Get trusted technical support", "Use your manufacturer or known IT support. Record the software name and incident time without reopening suspicious files.", "A trusted support route is available."],
            ["Check and remove harmful software", "Follow the device-specific recovery procedure before using it for sensitive accounts again.", "The device has been assessed."],
            ["Secure exposed accounts", "On a trustworthy device, secure accounts used during the session and contact your bank if financial access was exposed.", "Affected accounts have their own recovery steps."]
        ]],
    ["payment-fraud", "Sent money to a suspected scammer", "Contact the payment provider quickly and preserve transaction details.", "money", "Bank / payment app", "Any device", 10, "You transferred money or noticed an unauthorized transaction.", ["scam"], [
            ["Contact the payment provider now", "Use the number in your bank’s app, statement, or card. Explain the transaction and ask about a reversal or fraud process.", "You have contacted the provider."],
            ["Record the transaction details", "Keep the date, amount, recipient details, and reference in your private records.", "You have the information the provider needs."],
            ["Use your regional reporting route", "Select your region for official reporting resources. Reporting does not guarantee reimbursement.", "You know where to report."],
            ["Avoid recovery-fee offers", "Do not send another payment to someone promising to recover the first one.", "You have stopped further contact or payments."]
        ]],
    ["upi-fraud", "Report payment-app or UPI fraud in India", "Reach your bank or payment service and the national reporting portal.", "money", "UPI / payment app", "Phone", 10, "A payment in India was unauthorized or induced by a scam.", ["india", "scam"], [
            ["Contact your bank or payment app", "Use the fraud support route inside the official app or an independently verified bank contact.", "Your provider has the transaction reference."],
            ["Open the national reporting portal", "Visit cybercrime.gov.in directly. The portal’s current forms must be checked there; availability may vary.", "You have reached the official portal or recorded an access issue."],
            ["Keep a private record", "Record the payment reference, time, amount, and any report acknowledgment.", "You can follow up with the correct reference."],
            ["Follow the provider’s next steps", "Ask the bank how to secure the affected payment account and track your report.", "You have a next contact or action."]
        ]],
    ["identity-theft", "Someone is using your identity", "Build an official, region-appropriate identity recovery plan.", "money", "Identity services", "Any device", 20, "Accounts or activity appeared in your name without permission.", ["identity"], [
            ["Identify affected accounts", "List the organizations involved privately. Avoid posting identity documents in a public discussion.", "You have a private list of affected accounts."],
            ["Use an official recovery service", "In the US, IdentityTheft.gov provides reporting and tailored recovery steps. Elsewhere, use local official resources.", "You have selected the right jurisdiction."],
            ["Contact the affected organizations", "Follow the official plan to dispute fraudulent activity and protect relevant accounts.", "You have recorded each organization’s response."],
            ["Track follow-up actions", "Record reference numbers and dates privately. Set a reminder for the next required response.", "Your next follow-up is recorded."]
        ]],
    ["data-breach", "Received a data breach notification", "Match your response to the information that was exposed.", "money", "Any service", "Any device", 15, "An organization says some of your information may have been exposed.", ["breach"], [
            ["Verify the notification", "Open the organization’s website independently and find its breach notice.", "The notice comes from the actual organization."],
            ["Identify the exposed information", "Distinguish login credentials, payment details, and identity information; the response differs.", "You know which information is involved."],
            ["Choose the relevant recovery path", "Use password recovery, payment fraud, or identity-theft guidance as appropriate.", "You have a matching action plan."],
            ["Watch for follow-on scams", "Treat unsolicited messages referencing the breach cautiously and verify them independently.", "You know where to check future messages."]
        ]],
    ["stolen-iphone", "Protect a lost or stolen iPhone", "Use Apple’s device recovery controls and protect your account.", "devices", "Apple", "iPhone / Mac", 10, "Your iPhone or iPad is missing or was stolen.", ["iphone"], [
            ["Open Apple’s Find My route", "Use the official theft guide to reach iCloud Find Devices from a trustworthy device.", "You are signed into the official service."],
            ["Mark the device as lost", "If Find My was enabled, select the missing device and follow Mark as Lost instructions.", "Lost Mode is active or queued."],
            ["Contact your carrier", "Ask about securing your mobile service. Do not approach a suspected thief based on a location pin.", "Your mobile account has been addressed."],
            ["Consider next steps carefully", "Read Apple’s guidance before remote erase or removing the device. These actions affect data and protections.", "You understand the consequences before choosing."]
        ]],
    ["lost-android", "Protect a missing Android phone", "Find the official options for securing or locating your device.", "devices", "Google", "Android", 10, "Your Android phone or tablet is missing.", ["android"], [
            ["Open Google Find Hub", "Follow the official Android guide to the Find Hub app or website.", "You selected the correct device."],
            ["Review available security options", "The device’s power, connection, account, and prior setup affect what can work.", "You know which options are available."],
            ["Protect your mobile service", "Contact your carrier if the number or SIM is at risk. Avoid confronting someone at a mapped location.", "Your mobile service is accounted for."],
            ["Read before erasing", "Factory reset permanently deletes device data and ends Find Hub availability for that device.", "You have considered backups and consequences."]
        ]],
    ["sim-swap", "Suspect a SIM swap or number theft", "Check with your carrier and protect accounts using your phone number.", "devices", "Mobile carrier", "Phone", 15, "Your service stopped unexpectedly or a SIM-change notice appeared.", ["sim"], [
            ["Contact your carrier directly", "Use another device to reach the carrier through a known route. Ask whether your SIM or number was moved.", "The carrier has checked the account."],
            ["Restore control of your number", "Follow the carrier’s identity and recovery procedure; a service outage alone is not proof of fraud.", "You have control or an active recovery case."],
            ["Review linked accounts", "Check sensitive accounts that use the number, including email and financial services.", "Unfamiliar activity has been reported."],
            ["Strengthen account protection", "Ask about a carrier account PIN and stronger supported sign-in options for linked accounts.", "You have configured available protections."]
        ]],
    ["malware-check", "Check a device for possible malware", "Take a measured approach to suspicious software and behavior.", "malware", "Any service", "Computer", 25, "Software is behaving unexpectedly or your trusted security tool raised an alert.", ["malware"], [
            ["Record the symptom", "Note what changed. Slowness alone does not establish malware.", "You can describe the behavior."],
            ["Use trusted security tools", "Follow the official recovery guide and device manufacturer’s instructions for scans and updates.", "You have completed the applicable checks."],
            ["Get help if problems persist", "If you cannot remove a detected threat, contact trusted IT support before restoring normal use.", "An unresolved issue has an escalation path."],
            ["Review potentially exposed accounts", "Use a trustworthy device for any account recovery; prioritize accounts used on the affected device.", "Your account risks have been considered."]
        ]],
    ["ransomware", "Files locked by ransomware", "Contain the incident and find qualified recovery help.", "malware", "Any service", "Computer", 20, "Files became inaccessible and a ransom demand appeared.", ["ransom", "decrypt"], [
            ["Isolate affected systems", "Disconnect affected systems from networks. In a workplace, contact the incident-response team immediately.", "The affected systems are isolated."],
            ["Preserve information for responders", "Record the ransom note and incident details. Avoid wiping devices or connecting backup drives before advice.", "Relevant evidence remains available."],
            ["Check trusted recovery resources", "No More Ransom lists tools for certain ransomware variants. Match the exact case and read the instructions first.", "You know whether a relevant tool exists."],
            ["Plan a clean restoration", "Work with qualified support to remove the cause and restore verified backups safely.", "A restoration plan and clean environment are ready."]
        ]],
    ["browser-popups", "Stop suspicious browser pop-ups", "Review browser permissions and unwanted software without trusting scare alerts.", "malware", "Chrome", "Computer", 15, "Unexpected tabs, redirects, or infection warnings keep appearing.", ["chrome"], [
            ["Ignore payment or support demands", "Do not call numbers or install software advertised in the pop-up.", "You have stopped interacting with the alert."],
            ["Review site permissions", "In Chrome settings, review privacy/security and site permissions for intrusive content.", "Unwanted site permissions are corrected."],
            ["Check unwanted software", "Use the official instructions to identify unwanted programs before resetting browser settings.", "Unwanted software has been assessed."],
            ["Recheck normal browsing", "If symptoms continue, follow the device malware guide or contact trusted support.", "The symptoms are resolved or escalated."]
        ]],
    ["cloud-sharing", "A private file was shared publicly", "Review Google Drive permissions and reduce further exposure.", "safety", "Google Drive", "Any device", 10, "A file or folder can be accessed by people you did not intend.", ["drive"], [
            ["Inspect sharing permissions", "Open the file’s Share or Manage access controls and review the people and general-access settings.", "You know who currently has access."],
            ["Restrict unwanted access", "Remove unneeded collaborators and restrict general access. Review inherited folder permissions.", "The intended audience is shown."],
            ["Check published copies", "Public publishing is separate from sharing. Follow Google’s instructions to stop publishing if needed.", "Any unintended publishing has ended."],
            ["Assess what was exposed", "Permissions cannot recall copies already downloaded. If credentials or identity data were exposed, use the relevant guide.", "You have a plan for sensitive contents."]
        ]],
    ["monitoring-safety", "Worried someone is monitoring you?", "Start with personal safety and specialist support.", "safety", "Any service", "Any device", 15, "Someone may be misusing devices or accounts to monitor or control you.", ["safety", "stalker"], [
            ["Consider a safer device", "If possible, seek help from a device the person cannot access. Activity on a monitored device may be visible.", "You have considered a safer way to get help."],
            ["Plan before changing access", "Removing software or ending sharing may alert the person. Talk to a specialist advocate about a safety plan.", "You understand how changes could affect your safety."],
            ["Document only when safe", "Keep private notes about patterns and incidents if doing so is safe. Avoid confronting the person through the app.", "You have chosen a safe documentation approach."],
            ["Choose supported next steps", "Use specialist resources to review accounts, location sharing, and devices in a safe order.", "You have an individualized next action."]
        ]],
    ["image-abuse", "Someone is threatening to share intimate images", "Find private specialist support and appropriate removal tools.", "safety", "Social media", "Any device", 15, "Someone shared or threatened to share intimate images without consent.", ["ncii", "ncmec"], [
            ["Keep images out of this app", "Do not upload intimate images to RECLAIM or the community. You can get help without showing them here.", "No images have been posted here."],
            ["Choose the relevant specialist service", "For images taken under age 18, check Take It Down. For eligible adult images, check StopNCII.", "You reviewed the service’s eligibility rules."],
            ["Use the service’s own private process", "These services explain device-based hashing. Do not download or share images to create a submission.", "You understand how the selected service works."],
            ["Review reporting and support options", "Follow specialist guidance and the affected platform’s reporting process. Coverage is limited to participating services.", "You know the next support or reporting option."]
        ]],
    ["exposed-secret", "An API key or token was exposed", "Revoke the credential before cleaning up repository history.", "work", "GitHub", "Computer", 20, "A secret or private credential appeared in source code or a shared repository.", ["github"], [
            ["Revoke or rotate the credential", "Use the credential issuer’s controls. Deleting a file does not invalidate a copied secret.", "The exposed credential no longer works."],
            ["Assess use and impact", "Review relevant service activity and involve your security team if this is a work credential.", "You have identified the affected service."],
            ["Plan repository cleanup", "Follow GitHub’s instructions and coordinate with collaborators before rewriting history.", "Collaborators understand the cleanup plan."],
            ["Address remaining copies", "Forks, caches, and clones may retain the data. Follow provider support guidance where applicable.", "You have considered copies outside the main branch."]
        ]],
    ["repeat-compromise", "The problem came back after recovery", "Look beyond a password change to remaining access and recovery channels.", "accounts", "Any service", "Any device", 20, "Suspicious activity returned after you changed a password.", ["ncsc", "ftc-account"], [
            ["Check recovery dependencies", "Revisit the safety of your device and the email or phone used to recover the account.", "Recovery channels are accounted for."],
            ["Review sessions and connections", "Use the provider’s controls to end unwanted sessions and app access.", "Remaining access has been reviewed."],
            ["Inspect email rules", "Check filters and forwarding that could expose future reset messages.", "Unwanted routing has been removed."],
            ["Escalate persistent activity", "Keep a concise private timeline and contact official support or workplace IT.", "Support has the sequence of events."]
        ]],
];
export const guides: Guide[] = entries.map(([id, title, description, category, platform, device, minutes, fit, sourceIds, steps]) => ({ id, title, description, category, platform, device, minutes, fit, sourceIds, tags: [category, platform.toLowerCase(), ...title.toLowerCase().split(/\s+/)], version: 1, access: id === "google-account" ? "Both" : "Any", money: category === "money", region: id === "upi-fraud" ? "India" : "Global", level: id === "exposed-secret" || id === "ransomware" ? "More involved" : "Beginner", review: "Specialist review pending", steps: steps.map(([title, body, check, when], i) => ({ id: `${id}-${i}`, title, body, check: check || "You know your next action.", fallback: "If this option is unavailable, open the source instructions below. Record the blocker and use the provider’s official support route. Do not share credentials with anyone offering a shortcut.", sourceId: sourceIds[Math.min(i, sourceIds.length - 1)], phase: i === 0 ? "Do now" : i >= steps.length - 1 ? "Follow up" : "Do next", when })) }));
export const getGuide = (id: string) => guides.find(g => g.id === id);
export const getSource = (id: string) => sources.find(s => s.id === id)!;
export const regions = ["Global", "India", "United States", "United Kingdom", "Australia", "Other"];
export const glossary = { "MFA": "Multifactor authentication: an additional way to prove it is you when signing in.", "Passkey": "A sign-in credential usually unlocked with your device’s screen lock or biometrics.", "Session": "An ongoing signed-in connection to an account.", "Phishing": "A deceptive message or website that tries to get you to share information or take an unsafe action.", "Recovery code": "A private backup code for regaining access. Never put it in a community post.", "Ransomware": "Malicious software that may lock files or demand payment.", "SIM swap": "Moving a mobile number to another SIM, sometimes through impersonation.", "OAuth / connected app": "Permission for another service to access part of an account.", "Doxxing": "Publishing personal information to expose or harass someone." };
