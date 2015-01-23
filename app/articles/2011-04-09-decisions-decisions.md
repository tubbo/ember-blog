---

layout: post
title: "decisions, decisions"
category: code
date: 2011-04-09
tags: "unix, operating system, hardware, boxee, freenas"

---

Well I'm stuck in a bind. I can't seem to decide which operating system I want to run my all-powerful file server. A few days ago, my [wonderful sister][1] gifted me two computers, the Dell OptiPlex [GX270][2] and [GX280][3]. The basic difference between these two tried-and-true workhorses is the graphics card interface-the GX280 includes a PCI Express x16 slot whereas the GX270 is still using AGP-and of course the model number. Other than that, they use the same motherboard, same case design, and same basic layout. PERFECT for general hackery purposes...and running a Boxee...

So my first endeavor with these machines is something I've been needing for a long time: a file server to host all of the house's media. Everyone who lives in my house utilizes the internet or computers mostly for their media needs, and we've been longing for a way to experience it on a bigger screen. But a problem arises: These machines do not have the ability to pump S-Video to my regular TV, so I'm gonna need to wait a couple days before actually going ahead and opening up the boxes. I also need SATA cables and a SATA-to-IDE converter because the Dell OptiPlex motherboards come with IDE by default! By using both the SATA connector and the IDE connector adapted to a SATA connection, I'll be able to run a software RAID-0 array, mirroring the contents of the 1TB of space inside the box and therefore providing a greater level of security and stability to the system as a whole. With all of the hits it will be getting, this is a crucial step in extending the server's lifespan. 

This is actually a good thing, because it gives me a bit more time to decide on an operating system. What I need is very simple, I've boiled it down to only a few requirements:

* **I want ZFS.** It's amazing, the technology we have today. ZFS is this wonderful file system developed by the good ol' boys over at [Sun Microsystems][3] (now [Oracle][4]) that addresses many of the problems of former filesystems and even some of the problems of magnetic hard drives themselves. ZFS even introduces new features like built-in SMB/Netatalk capabilities, making it a lot easier to transfer data from the server to the computers where it will actually be useful.

* **I want complete Boxee transparency.** The Boxee will be the major customer of this server, constantly pulling data from the media drive "/Zappa" to fulfill its users demands of the music library. Now that all music can be accessed from the living room's 3-way stereo system, I'm predicting that my roommates will be hitting the Boxee a lot more, and thus the fileserver.

Right now, my best option is **[FreeNAS][6]**, it's a distribution of [FreeBSD][7] (an OS I know and love) that's specially formulated to act as a network storage device. Precisely what I'm looking for! It's even bundled with a [DAAP server][7] and [NFS][8] so the Boxee can be "tricked" into thinking /Zappa *is actually a part of its own local filesystem*. The possibilities are endless, allowing for seamless integration of the data on these disks to the entire network here at 1913.

I think my choice has been made.

**UPDATE:** My FreeNAS file server is running smoothly, fully jailed. Story at 11.

**Technorati Claim ID:** NFGKYZ5CMSY2

[1]: http://geekwitch.livejournal.com/
[2]: http://support.dell.com/support/edocs/systems/opgx270/en/ug/index.htm
[3]: http://support.dell.com/support/edocs/systems/opgx280/en/ug/index.htm
[4]: http://sun.com
[5]: http://oracle.com
[6]: http://freenas.org
[7]: http://en.wikipedia.org/wiki/Firefly_Media_Server
[8]: http://psychedeli.ca/code/2011/09/25/hell-yeah-freenas
