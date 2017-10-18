#
# Used this to check if u_y had any interesting effeks, turns out it dosn't :-(

import numpy as np
import matplotlib.pyplot as plt

import trajectory

def main():
    tr = trajectory.trajectory()
    fig, a = plt.subplots(3, 3, figsize=(10,10))

    t1 = 1e-9
    for ay, fuy in zip(a, [0, 1, 10]):
        for ax, fux in zip(ay, [0, 1, 5]):
            tr.ux = fux*tr.v
            tr.uy = fuy*tr.v
            tr.plot(0, t1, ax, False)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
