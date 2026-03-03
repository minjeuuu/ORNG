import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import pandas as pd
import numpy as np

root = tk.Tk()
root.title("ORNG Intraday Live Dashboard")

tk.Label(root, text="ORNG Dashboard Active").pack()

root.mainloop()
