import re

with open('admin.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the faulty auto-bind
buggy_code = """    // Auto-Bind context if nothing binds yet
    if(!unsubChat) { switchGroupContext(currentAdminGroup); }"""

text = text.replace(buggy_code, "")

# And actually initialize the binding ONCE in initAdminData instead!
init_old = """            totalGroups = doc.data().group_count || 4;
            document.getElementById("group-count-input").value = totalGroups;
            renderGroupTabs();
        } else {
            renderGroupTabs();
        }"""

init_new = """            totalGroups = doc.data().group_count || 4;
            document.getElementById("group-count-input").value = totalGroups;
            renderGroupTabs();
            if(!unsubChat) switchGroupContext(currentAdminGroup);
        } else {
            renderGroupTabs();
            if(!unsubChat) switchGroupContext(currentAdminGroup);
        }"""

text = text.replace(init_old, init_new)

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(text)

