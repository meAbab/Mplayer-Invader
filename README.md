<<<<<<< HEAD
# fireweb

One of my long time client, often taking different solution if many different projects and paying me with very good money,
is often travelling here and there. Thus required for him to login from different source IP from different network type.

That's let me to inspire learn perl and program this package. This program will actually allow you a web interface asking secret to allow your current public IP to get access to the server. Once your secret is correct your current IP will allowed to system and all others will blocked (DROP). This IP will remain unchanged until you did the above task again. 

--> You also need to uncommend line 40 to get the DROP function active. Uncomment it with your own risk. 

   --> Once you forgot the secret, with DROP all command active - you'll not able to login your own server                   until your current public IP not mached with the IP last time your system updated.

I must say, that its not properly secure - as you need to put ssl and encryption technique also not upto par.
As program Source code contain the key. So better use ssl and use random value and updated hash algorithm.

In mean time, if I'm able to a save time dispite hunting food and cloths, I'll update it.


REQUIREMENT
--------------------
1. You need perl and perl-cgi enabled in your machine and apache.
2. Need Crypt:CBC - use CPAN to install it

          # perl -MCPAN -e shell
          > install Crypt::CBC

3. Default Pass is - khubGopon
4. You need to change your sudoers file [or use visudo] to allow apache user to run iptables.

          ## Allow root to run any commands anywhere
          root    ALL=(ALL)       ALL
          user-foo        ALL= NOPASSWD: /sbin/iptables

5. And follow all other settings that need to run a perl script, i.e. let file executable, giving right owner/group(ship) etc.
=======
# Mplayer-Invader
I need to work in a project for my Advance JavaScript course to build a multiplayer online game.
The game is based on Phaser engine and extension of Phaser Invader example. I also added WebRTC so player can make audio
conference among them (also has option that player can allow or deny somebody's conference request).

Here are the scattered files of that project, I'm searching the final presentaion one. Once found will update here.

It need node.js, Phaser.io, socket.io and a webRTC engine to run the whole game.
>>>>>>> a0af156f626e57e6f69b0fcd6aaa4c89574346f3
