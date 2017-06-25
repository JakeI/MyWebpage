import numpy as np

class trajectory(object):

    def __init__(self):
        self.x0 = 0.0  # initial x position x0 == x(0)
        self.y0 = 0.0  # initial y position y0 == y(0)
        self.ux = 0.0  # initial speed in x drietction ux == vx(0)
        self.uy = 0.0  # initial speed in y direction uy == vy(0)

        self.E = 30000  # Electric field in V/m
        self.B = 0.3  # Magnetic vield in T
        self.m = 9.109e-31  # Electron mass in kg
        self.q = -1.602e-19  # Electron charge in C == elementary charge

        self._update_consts()

    def _update_consts(self):
        self.w = self.q*self.B/self.m  # anglular vilcity omega
        self.v = self.E/self.B  # average vilocity bar{v}

    # Position Functions
    def x(self, t):
        self._update_consts()
        wt = self.w*t
        return (self.ux*np.sin(wt) + self.uy*(np.cos(wt) - 1) + self.v*(wt - np.sin(wt)))/self.w + self.x0
    def y(self, t):
        self._update_consts()
        wt = self.w*t
        return (self.ux*(1 - np.cos(wt)) + self.uy*np.sin(wt) + self.v*(np.cos(wt) - 1))/self.w + self.y0

    # Vilocity Functions
    def vx(self, t):
        self._update_consts()
        wt = self.w*t
        return self.ux*np.cos(wt) - self.uy*np.sin(wt) + self.v*(1 - np.cos(wt))
    def vy(self, t):
        self._update_consts()
        wt = self.w*t
        return self.ux*np.sin(wt) + self.uy*np.cos(wt) - self.v*np.sin(wt)


    def get_range(x, m=0.2, return_h=False):
        """ returns a visualli pleasing axisrange, that corresponds to the data vectro x """
        mi, ma = np.min(x), np.max(x)
        h = m*(ma-mi)
        h2 = h
        if h == 0.0:
            h = m*1e-5
            h2 = h/6
        if return_h:
            return (mi-h, ma+h, h, h2)
        else:
            return (mi-h, ma+h)

    def get_str(n):
        """ Converts the float n to Mathtex interpretable format """
        s = "%s" % n
        ss = "%.1e" % n
        if len(ss) < len(s):
            s = ss
        if "e" in s:
            s = s.replace("e", "\\cdot 10^{") + "}"
        return s

    def plot(self, t0, t1, ax, labels=True, mode="plot", data=None):
        """ Plots the trajectory to ax on a time range form t0 to t1 """

        create = mode == "plot" or mode == "create"

        if create:
            ax.ticklabel_format(style='sci', axis='x', scilimits=(0,0))
            ax.ticklabel_format(style='sci', axis='y', scilimits=(0,0))
        #ax.grid()
        if create:
            t = np.linspace(t0, t1, 1000)
        else:
            t = data["t"]

        x, y = self.x(t), self.y(t)

        if create:
            line, = ax.plot(x, y, color=(1,140/255,0), linewidth=2) # color=darkorange (the webpages akcent color)
        else:
            line = data["line"]
            line.set_xdata(x)
            line.set_ydata(y)

        if mode == "create":
            xmin, xmax, ymin, ymax = data
            get_range = lambda ma, mi, m: (mi-m*(ma-mi), ma+m*(ma-mi))
            ax.set_xlim(*get_range(xmax, xmin, 0.02))
            ax.set_ylim(*get_range(ymax, ymin, 0.1))
        elif mode == "plot":
            ax.set_xlim(*trajectory.get_range(x, 0.02))
            ax.set_ylim(*trajectory.get_range(y, 0.1))

        if labels and create:
            ax.set_xlabel("$x(t), \\; m$")
            ax.set_ylabel("$y(t), \\; m$")

        if labels:
            ax.set_title("$t \\in [ %ss; %ss ], \\; u_x = %s\\frac{m}{s}$" % \
                (trajectory.get_str(t0), trajectory.get_str(t1), trajectory.get_str(self.ux)))

        if mode == "create":
            return dict(t=t, line=line)

    def valpha(self, ax, labels=True):
        """ Plots a magnitude of vilocity vs angle of vilocity diagram for one periode (a polar plot for the vilocity vector) """
        t = np.linspace(0, 2*np.pi/self.w, 1000)
        vx, vy = self.vx(t), self.vy(t)
        v = np.sqrt(vx**2 + vy**2)
        alpha = np.arctan2(vy, vx)
        ax.plot(alpha, v)

    def get_ratio_r(self, alpha_deg=5, precision=3):
        t = np.linspace(0, np.abs(2*np.pi/self.w), precision*1000)
        alpha = (180/np.pi)*np.arctan2(self.vy(t), self.vx(t))

        idx_top = list(np.argwhere(np.diff(np.sign(alpha - alpha_deg)) != 0).reshape(-1))
        idx_bottom = list(np.argwhere(np.diff(np.sign(alpha + alpha_deg)) != 0).reshape(-1))

        if len(idx_top) == 2:
            inter_top_t = t[idx_top]
        elif len(idx_top) == 1:
            inter_top_t = [t[idx_top], t[idx_top]]
        else:
            inter_top_t = [-100, -100]

        if len(idx_bottom) == 2:
            inter_bottom_t = t[idx_bottom]
        elif len(idx_bottom) == 1:
            if self.ux == 0.0:
                inter_bottom_t = [t[idx_bottom], np.max(t)]
            else:
                inter_bottom_t = [t[idx_bottom], t[idx_bottom]]
        else:
            inter_bottom_t = [-100, -100]

        if len(idx_top) >= 1 and len(idx_bottom) >= 1:
            dist = np.max(t) - np.min(t) - (inter_top_t[1] - inter_top_t[0] + inter_bottom_t[1] - inter_bottom_t[0])
        else:
            dist = np.max(t) - np.min(t)

        return 100*dist/(np.max(t)-np.min(t))

    def alpha_time(self, ax, labels=True, alpha_deg=5, mode="plot", data=None):
        """ Plots time vs alpha = v_y / v_x on ax """

        create = mode == "plot" or mode == "create"

        #constants
        col = (0.4,0.4,0.4)

        #allok memory / assign vars
        if create:
            t1 = np.abs(2*np.pi/self.w)
            t = np.linspace(0, t1, 1000)
        else:
            t = data["t"]

        alpha = (180/np.pi)*np.arctan2(self.vy(t), self.vx(t))

        #create/update line
        if create:
            line, = ax.plot(t, alpha, linewidth=2, color=(1,140/255,0))
        else:
            line = data["line"]
            line.set_xdata(t)
            line.set_ydata(alpha)

        #create top and bottom lines
        if create:
            top_line, = ax.plot([0, t1], [alpha_deg, alpha_deg], color=col)
            bottom_line, = ax.plot([0, t1], [-alpha_deg, -alpha_deg], color=col)

        #find intersections
        idx_top = list(np.argwhere(np.diff(np.sign(alpha - alpha_deg)) != 0).reshape(-1))
        idx_bottom = list(np.argwhere(np.diff(np.sign(alpha + alpha_deg)) != 0).reshape(-1))

        #create/update left, right line
        if create:
            left_dot, = ax.plot(t[idx_top], alpha_deg*np.ones_like(idx_top), 'ko')
            right_dot, = ax.plot(t[idx_bottom], -alpha_deg*np.ones_like(idx_bottom), 'ko')
        else:
            left_dot, right_dot = data["left_dot"], data["right_dot"]
            left_dot.set_xdata(t[idx_top])
            left_dot.set_ydata(alpha_deg*np.ones_like(idx_top))
            right_dot.set_xdata(t[idx_bottom])
            right_dot.set_ydata(-alpha_deg*np.ones_like(idx_bottom))

        if len(idx_top) == 2:
            inter_top_t = t[idx_top]
        elif len(idx_top) == 1:
            inter_top_t = [t[idx_top], t[idx_top]]
        else:
            inter_top_t = [-100, -100]

        if create:
            left_line_1, = ax.plot([inter_top_t[0], inter_top_t[0]], [-1000, 1000], color=col)
            left_line_2, = ax.plot([inter_top_t[1], inter_top_t[1]], [-1000, 1000], color=col)
            left_line = (left_line_1, left_line_2)
        else:
            left_line = data["left_line"]
            left_line[0].set_xdata([inter_top_t[0], inter_top_t[0]])
            left_line[1].set_xdata([inter_top_t[1], inter_top_t[1]])

        if len(idx_bottom) == 2:
            inter_bottom_t = t[idx_bottom]
        elif len(idx_bottom) == 1:
            if self.ux == 0.0:
                inter_bottom_t = [t[idx_bottom], np.max(t)]
            else:
                inter_bottom_t = [t[idx_bottom], t[idx_bottom]]
        else:
            inter_bottom_t = [-100, -100]

        if create:
            right_line_1, = ax.plot([inter_bottom_t[0], inter_bottom_t[0]], [-1000, 1000], color=col)
            right_line_2, = ax.plot([inter_bottom_t[1], inter_bottom_t[1]], [-1000, 1000], color=col)
            right_line = (right_line_1, right_line_2)
        else:
            right_line = data["right_line"]
            right_line[0].set_xdata([inter_bottom_t[0], inter_bottom_t[0]])
            right_line[1].set_xdata([inter_bottom_t[1], inter_bottom_t[1]])

        if len(idx_top) >= 1 and len(idx_bottom) >= 1:
            dist = np.max(t) - np.min(t) - (inter_top_t[1] - inter_top_t[0] + inter_bottom_t[1] - inter_bottom_t[0])
            #dist = np.max(t) - inter_top_t + np.min(t) - inter_bottom_t
        else:
            dist = np.max(t) - np.min(t)

        if labels and create:
            ax.set_xlabel("$t, \\; s$")
            ax.set_ylabel("$\\alpha = \\arg\\{v_x + i v_y\\}, \\deg$")

        if labels:
            ax.set_title("$t \\in [0, \\frac{2 \\pi}{\\omega}], \\; u_x = %s\\frac{m}{s}$" %
                            trajectory.get_str(self.ux))

        if mode == "plot":
            xmin, xmax, xh, xh2 = trajectory.get_range(t, 0.02, return_h=True)
            ax.set_xlim(xmin, xmax)
            ymin, ymax, yh, yh2 = trajectory.get_range(alpha, 0.1, return_h=True)
            ax.set_ylim(ymin, ymax)

        if mode == "create":
            xmin, xmax, ymin, ymax = data
            get_range = lambda ma, mi, m: (mi-m*(ma-mi), ma+m*(ma-mi))
            ax.set_xlim(*get_range(xmax, xmin, 0.02))
            ax.set_ylim(*get_range(ymax, ymin, 0.1))
            xh2 = 0.02*(xmax-xmin)
            yh2 = 0.1*(ymax-ymin)

        if create:
            ax.ticklabel_format(style='sci', axis='x', scilimits=(-3,3), useMathText=True)
            ax.ticklabel_format(style='sci', axis='y', scilimits=(-3,3), useMathText=True)

        if create:
            text = ax.text(xmin+xh2, ymin+yh2, "$r = %.1f\\%%$" % (100*dist/(np.max(t)-np.min(t)), ))
        else:
            text = data["text"]
            text.set_text("$r = %.1f\\%%$" % (100*dist/(np.max(t)-np.min(t)), ))

        if mode == "create":
            data = dict(t=t, line=line, left_line=left_line, right_line=right_line, text=text,
                        left_dot=left_dot, right_dot=right_dot)
            return data

    def plot_vx(self, ax, mode="plot", data=None):

        create = mode == "plot" or mode == "create"

        if create:
            t = np.linspace(0, np.abs(2*np.pi/self.w), 1000)
        else:
            t = data["t"]

        v = lambda t: np.sqrt(self.vx(t)**2 + self.vy(t)**2)

        if create:
            line, = ax.plot(t, v(t), '--', linewidth=1, color=(1,60/255,0))
        else:
            line = data["line"]
            line.set_ydata(v(t))

        if create:
            ax.ticklabel_format(style='sci', axis='y', scilimits=(-3,3), useMathText=True)
            ax.set_ylabel("$v, m/s$")

        if mode == "create":
            mi, ma = data[0], data[1]
            h = 0.05*(ma-mi)
            ax.set_ylim(mi-h, ma+h)
        elif mode == "plot":
            ax.set_ylim(*trajectory.get_range(v(t), 0.05))

        if mode == "create":
            return dict(t=t, line=line)
