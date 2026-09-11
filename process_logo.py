import sys
from PIL import Image

def process(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            intensity = (item[0] + item[1] + item[2]) / 3
            # Set color to white, alpha to intensity
            new_data.append((255, 255, 255, int(intensity)))
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    process(sys.argv[1], sys.argv[2])
