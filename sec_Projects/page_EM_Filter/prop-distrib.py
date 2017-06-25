import numpy as np
import matplotlib.pyplot as plt

import trajectory

def main():
    tr = trajectory.trajectory()
    fig, (ax) = plt.subplots(1, 1, figsize=(6,4))

    ux = np.linspace(0, 5*tr.v, 200)

    def get_r(**kwargs):
        list_r = []
        for uxx in list(ux):
            tr.ux = uxx
            list_r.append(tr.get_ratio_r(**kwargs))
        return np.array(list_r)

    ax.plot(ux, get_r(alpha_deg=10, precision=1), '--', linewidth=1, label="$\\pm 10^{\circ}$")
    ax.plot(ux, get_r(alpha_deg=5, precision=1), linewidth=2, color=(1,140/255,0), label="$\\pm 5^{\circ}$")
    ax.plot(ux, get_r(alpha_deg=1, precision=1), '--', linewidth=1, label="$\\pm 1^{\circ}$")

    ax.ticklabel_format(style='sci', axis='x', scilimits=(-3,3), useMathText=True)
    ax.set_xlabel("$u_x, m/s$")
    ax.set_ylabel("$r, \\%%$")

    plt.legend()

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
