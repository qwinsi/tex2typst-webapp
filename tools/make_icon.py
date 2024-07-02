# create the icon file of the project.

# This script requires the Python Imaging Library (PIL) to be installed.
# If you don't have PIL, you can install it with pip:
# pip install pillow

from PIL import Image, ImageDraw, ImageFont

# Define the icon size and colors
icon_size = (160, 160)
background_color = (0, 119, 199)  # Sky blue
text_color = (255, 255, 255)  # White

# Create a new image with the background color
icon = Image.new('RGB', icon_size, background_color)
# Create a drawing context
draw = ImageDraw.Draw(icon)
# Load a font file
font = ImageFont.truetype('arial.ttf', 100)
# Draw text
draw.text((15, 25), 'TT', fill=text_color, font=font)
# Save the icon file
icon.save('favicon.png', 'PNG')