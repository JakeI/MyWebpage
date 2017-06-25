import numpy as np
import matplotlib.pyplot as plt

import trajectory

def main():
    tr = trajectory.trajectory()
    fig, (ax, bx, cx) = plt.subplots(3, 1, figsize=(6,6))

    t1 = 1e-9

    tr.ux = 0
    tr.plot(0, t1, ax)
    tr.ux = tr.v
    tr.plot(0, t1, bx)
    tr.ux = 5*tr.v
    tr.plot(0, t1, cx)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
