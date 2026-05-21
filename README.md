# Hearth
A winter survival game where you power a mushroom house's furnace to survive the cold.

Built for CSE493F Physical Computing at the University of Washington.

---

## Demo
[Watch it here](https://drive.google.com/file/d/1U5KyB1wSFaI3BTKIakSfxqGO0DPHwHip/view?usp=sharing)

---

## Overview
Hearth is a bidirectional embedded system connecting a custom physical controller 
to a real-time p5.js web app via Serial UART. The player spins a laser-cut wheel 
to generate power and swings an accelerometer-embedded hammer to fix breakdowns, 
all while managing the mushroom house's temperature to survive winter.

---

## How It Works
- **Spin the wheel** -> hall effect sensor detects magnet passes -> sends power to web app
- **Swing the hammer** -> accelerometer detects impact -> sends fix event to web app
- **Web app** -> manages temperature, win/lose conditions -> sends LED color and buzzer tone back to Arduino
- **RGB LED** -> inside miniature mushroom house glows blue (cold) -> orange (safe) -> red (overheating)

---

## Hardware
- Arduino Leonardo
- DRV5055A1 Hall Effect Sensor
- ADXL343 Accelerometer
- RGB LED
- Piezo Buzzer
- Laser-cut wheel and stand (custom designed in Glowforge & Adobe Illustrator)
- 3D-printed miniature mushroom house

---

## Circuit Diagram
<img width="400" height="450" alt="Screenshot 2026-05-21 at 13 23 05" src="https://github.com/user-attachments/assets/afd78664-f319-476e-ae4d-32115340eff1" />

Notes: 
- Tinkercad does not have accelerometer components, so I have attached a circuit diagram from another source.
- Tinkercad also doesn’t have Hall Effect Sensors, so it is substituted for a transistor here

---

## Wheel Design Iterations
The wheel broke during the class showcase — here's the full iteration process:

| Prototype | Issue | Fix |
|-----------|-------|-----|
| <img width="5712" height="4284" alt="IMG_2110" src="https://github.com/user-attachments/assets/b562fa20-c6c2-42c0-9870-e6349aff0070" />| Broke at showcase, too fragile (used hot glue gun and plastic straw) | Used bolts, washers, and nuts instead. Also added holes for magnet securing and the handle. |
| <img width="4032" height="3024" alt="IMG_2111" src="https://github.com/user-attachments/assets/e00d4f02-3d86-4773-b04b-bdfb9b709641" />| The wheel could not reliably move due to the tightness from the washers and nuts | Used a makeshift sleeve from a cut up plastic straw slightly longer than the disk's thickeness. Also added holes for wires to pass through and be secured.|
| <img width="1215" height="793" alt="Screenshot 2026-05-21 at 13 27 05" src="https://github.com/user-attachments/assets/cab9765b-f2ad-44e8-9b2c-0b9f07f0c698" /> <img width="200" height="250" alt="IMG_2113" src="https://github.com/user-attachments/assets/ec8d4985-dcc8-4c77-8f8f-d7905c440e40" /> <img width="200" height="250" alt="IMG_2112" src="https://github.com/user-attachments/assets/982b3db3-747c-4bd3-883f-9bab4950d21c" />| Spin is reliable but the set up is a bit finicky. | Use ball bearings instead. |
| To be continued | - | - |

---

## Software
- **Arduino (C++)**: sensor reading, Serial communication, LED + buzzer output
- **p5.js**: game loop, temperature simulation, visual rendering, Web Serial API
---

## Related Projects
Part of a physical computing project series:
- [Rapunzel's Flower Lamp](https://www.linkedin.com/posts/ian-limasi-430036238_hardware-rapunzel-outofmycomfortzone-ugcPost-7457895453422964736-uP-l?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADsX3eQBAuc4edZoVIpxvKwBaGZ6K89mt0A): audio-reactive servo + LED lamp + low-fidelity analog input
- [Cooking Mania Game](https://www.linkedin.com/posts/ian-limasi-430036238_hardware-cookingmama-outofmycomfortzone-ugcPost-7461581469124050944-N8Av?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADsX3eQBAuc4edZoVIpxvKwBaGZ6K89mt0A): accelerometer-driven cardboard & OLED cooking game with haptic feedback
---
