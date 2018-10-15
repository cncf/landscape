"""
Spyder Editor

This is a temporary script file.
"""
import matplotlib 
import matplotlib.pyplot as plt 
import numpy as np # Data for plotting 
t = np.arange(0.0, 2.0, 0.01) 
s = 1 + np.sin(2 * np.pi * t) 
plt.plot(t, s,color='r') 
plt.xlabel('Time (s)') 
plt.ylabel('Voltage (mV)') 
plt.title('Voltage vs Time for a sinewave', fontsize=20) # Big font for title 
plt.grid() # Draw gridlines 
plt.savefig("sinewave.png") # Save to file 
plt.show() # Display on screen
