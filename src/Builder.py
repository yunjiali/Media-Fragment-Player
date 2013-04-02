import sys
import os
import shutil

me_filename = 'mediaelement'
mep_filename = 'mediaelementplayer'
smfplayer_filename = 'smfplayer'
combined_filename = 'mediaelement-and-player'

# BUILD MediaElement (single file)

print('building MediaElement.js')
me_files = []
me_files.append('me-header.js')
me_files.append('me-namespace.js')
me_files.append('me-utility.js')
me_files.append('me-plugindetector.js')
me_files.append('me-featuredetection.js')
me_files.append('me-mediaelements.js')
me_files.append('me-shim.js')

code = ''

for item in me_files:
	src_file = open('mediaelementjs/js/' + item,'r')
	code += src_file.read() + "\n"

tmp_file = open('../build/' + me_filename + '.js','w')
tmp_file.write(code)
tmp_file.close()

# BUILD MediaElementPlayer (single file)
print('building MediaElementPlayer.js')
mep_files = []
mep_files.append('mep-header.js')
mep_files.append('mep-library.js')
mep_files.append('mep-player.js')
mep_files.append('mep-feature-playpause.js')
mep_files.append('mep-feature-stop.js')
mep_files.append('mep-feature-progress.js')
mep_files.append('mep-feature-time.js')
mep_files.append('mep-feature-volume.js')
mep_files.append('mep-feature-fullscreen.js')
mep_files.append('mep-feature-tracks.js')
mep_files.append('mep-feature-contextmenu.js')
# mep_files.append('mep-feature-sourcechooser.js')

code = ''

for item in mep_files:
        src_file = open('mediaelementjs/js/' + item,'r')
        code += src_file.read() + "\n"

tmp_file = open('../build/' + mep_filename + '.js','w')
tmp_file.write(code)
tmp_file.close()


# BUILD Synote Media Fragment Player (single file)
print('building smfplayer.js')
smfp_files = []
smfp_files.append('mediafragments.js')
smfp_files.append('synote.multimedia.namespace.js')
smfp_files.append('synote.multimedia.utils.js')
smfp_files.append('jquery.url.js')
smfp_files.append('synotemfplayer.js')

code = ''

for item in smfp_files:
        src_file = open(item,'r')
        code += src_file.read() + "\n"

tmp_file = open('../build/' + smfplayer_filename + '.js','w')
tmp_file.write(code)
tmp_file.close()

# MINIFY both scripts

print('Minifying JavaScript')
# os.system("java -jar yuicompressor-2.4.2.jar ../build/" + me_filename + ".js -o ../build/" + me_filename + ".min.js --charset utf-8 -v")
# os.system("java -jar yuicompressor-2.4.2.jar ../build/" + mep_filename + ".js -o ../build/" + mep_filename + ".min.js --charset utf-8 -v")
os.system("java -jar compiler.jar --js ../build/" + me_filename + ".js --js_output_file ../build/" + me_filename + ".min.js")
os.system("java -jar compiler.jar --js ../build/" + mep_filename + ".js --js_output_file ../build/" + mep_filename + ".min.js")
os.system("java -jar compiler.jar --js ../build/" + smfplayer_filename + ".js --js_output_file ../build/" + smfplayer_filename + ".min.js")


# PREPEND intros
def addHeader(headerFilename, filename):

	# get the header text
	tmp_file = open(headerFilename)
	header_txt = tmp_file.read();
	tmp_file.close()

	# read the current contents of the file
	tmp_file = open(filename)
	file_txt = tmp_file.read()
	tmp_file.close()
	
	# open the file again for writing
	tmp_file = open(filename, 'w')
	tmp_file.write(header_txt)
	# write the original contents
	tmp_file.write(file_txt)
	tmp_file.close()
	
addHeader('mediaelementjs/js/me-header.js', '../build/' + me_filename + '.min.js')
addHeader('mediaelementjs/js/mep-header.js', '../build/' + mep_filename + '.min.js')
addHeader('synote.multimedia.header.js', '../build/' + smfplayer_filename + '.min.js')


# COMBINE into single script
print('Combining scripts')
code = ''
src_file = open('../build/' + me_filename + '.js','r')
code += src_file.read() + "\n"
src_file = open('../build/' + mep_filename + '.js','r')
code += src_file.read() + "\n"
#src_file = open('../build/' + smfplayer_filename + '.js','r')
#code += src_file.read() + "\n"

tmp_file = open('../build/' + combined_filename + '.js','w')
tmp_file.write(code)
tmp_file.close()

code = ''
src_file = open('../build/' + me_filename + '.min.js','r')
code += src_file.read() + "\n"
src_file = open('../build/' + mep_filename + '.min.js','r')
code += src_file.read() + "\n"
#src_file = open('../build/' + smfplayer_filename + '.min.js','r')
#code += src_file.read() + "\n"

tmp_file = open('../build/' + combined_filename + '.min.js','w')
tmp_file.write(code)
tmp_file.close()


# MINIFY CSS
print('Minifying CSS')
code=''
src_file = open('mediaelementjs/css/mediaelementplayer.css','r')
code+=src_file.read()+"\n"
tmp_file = open('../build/mediaelementplayer.css','w')
tmp_file.write(code)
tmp_file.close()
os.system("java -jar yuicompressor-2.4.2.jar ../build/mediaelementplayer.css -o ../build/mediaelementplayer.min.css --charset utf-8 -v")

#Copy smfplayer.css
shutil.copy2('css/smfplayer.css','../build/smfplayer.css')

#COPY skin files
print('Copying Skin Files')
shutil.copy2('mediaelementjs/css/controls.png','../build/controls.png')
shutil.copy2('mediaelementjs/css/bigplay.png','../build/bigplay.png')
shutil.copy2('mediaelementjs/css/loading.gif','../build/loading.gif')

shutil.copy2('mediaelementjs/css/mejs-skins.css','../build/mejs-skins.css')
shutil.copy2('mediaelementjs/css/controls-ted.png','../build/controls-ted.png')
shutil.copy2('mediaelementjs/css/controls-wmp.png','../build/controls-wmp.png')
shutil.copy2('mediaelementjs/css/controls-wmp-bg.png','../build/controls-wmp-bg.png')

print('DONE!')
