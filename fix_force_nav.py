import re

with open('admin.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_save = """    // If the admin checked it (meaning it's transitioning to True and we pass a target)
    // we want to force navigation. We'll simply append a trigger.
    if (forceTabTarget) {
        payload.force_tab = forceTabTarget;
        payload.force_time = Date.now();
    }"""

new_save = """    // Only force navigation if the triggered checkbox is actually ACTIVED (checked).
    // We check this by scanning which key is associated with the forceTabTarget and if it is true.
    let isChecked = false;
    if (forceTabTarget === 'tab-products' && payload.show_produkte) isChecked = true;
    if (forceTabTarget === 'tab-bilanz' && payload.show_bilanz) isChecked = true;
    if (forceTabTarget === 'tab-lagebericht' && payload.show_lagebericht) isChecked = true;
    if (forceTabTarget === 'tab-market' && payload.show_marktdaten) isChecked = true;
    if (forceTabTarget === 'tab-chat-unternehmen' && payload.show_chat) isChecked = true;
    if (forceTabTarget === 'tab-chat-bank' && payload.show_bank_chat) isChecked = true;
    if (forceTabTarget === 'tab-task' && payload.show_aufgaben) isChecked = true;

    if (forceTabTarget && isChecked) {
        payload.force_tab = forceTabTarget;
        payload.force_time = Date.now();
    }"""

text = text.replace(old_save, new_save)
with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(text)

