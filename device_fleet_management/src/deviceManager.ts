export interface Device {
  id: string;
  name: string;
  version: string;
  user_id: string;
  status: 'active' | 'inactive';
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Point {
  la: number;
  lo: number;
}

export class DeviceManager {
  deviceMap: Map<string, Device>;
  c: number;
  vD: Map<string, Set<Device>>;
  uD: Map<string, Set<Device>>;
  sD: Map<string, Set<Device>>;
  cDa: Map<Point, Set<Device>>;
  cDo: Map<Point, Set<Device>>;

  // constructor, gets called when a new instance of the class is created
  constructor() {
    this.deviceMap = new Map<string, Device>();
    this.c = 0;
    this.vD = new Map<string, Set<Device>>();
    this.uD = new Map<string, Set<Device>>();
    this.sD = new Map<string, Set<Device>>();
    this.cDa = new Map<Point, Set<Device>>();
    this.cDo = new Map<Point, Set<Device>>();
  }

  addDevice(device: Device): void {
    if (device.id === "") {
      throw new Error("Device must have an id");
    }

    if (this.deviceMap.get(device.id)) {
      throw new Error(`Device with id ${device.id} already exists`);
    }

    this.deviceMap.set(device.id, device);

    this.c++;

    const v = this.vD.get(device.version);

    if (v) {
      v.add(device);
    } else {
      this.vD.set(device.version, new Set([device]));
    }

    const u = this.uD.get(device.user_id);

    if (u) {
      u.add(device);
    } else {
      this.uD.set(device.user_id, new Set([device]));
    }

    const s = this.sD.get(device.status);

    if (s) {
      s.add(device);
    } else {
      this.sD.set(device.status, new Set([device]));
    }
  }

  removeDevice(id: string): void {
    const d = this.deviceMap.get(id);

    if (d) {
      this.c--;

      const v = this.vD.get(d.version);
      if (v) { v.delete(d); }

      const u = this.uD.get(d.user_id);
      if (u) { u.delete(d); }

      const s = this.sD.get(d.status);
      if (s) { s.delete(d); }

      this.deviceMap.delete(id);
    } else {
      throw new Error(`Device with id ${id} not found`);
    }
  }

  getDevice(id: string): Device | null {
    const d = this.deviceMap.get(id);

    if (d) {
      return d;
    } else {
      return null;
    }
  }

  getDevicesByVersion(version: string): Device[] | null {
    const v = this.vD.get(version);

    if (v) {
      return Array.from(v);
    } else {
      return [];
    }
  }

  getDevicesByUserId(user_id: string): Device[] | null {
    const u = this.uD.get(user_id);

    if (u) {
      return Array.from(u);
    } else {
      return [];
    }
  }

  getDevicesByStatus(status: 'active' | 'inactive' | 'pending' | 'failed'): Device[] | null {
    const s = this.sD.get(status);

    if (s) {
      return Array.from(s);
    } else {
      return [];
    }
  }

  getDevicesInArea(latitude: number, longitude: number, radius_km: number): Device[] | null {
    // returns all devices within a radius of the given latitude and longitude
    // the radius is in kilometers
    return null;
  }

  getDevicesNearDevice(device_id: string, radius_km: number): Device[] | null {
    // returns all devices within a radius of the given device (not including the device itself)
    // the radius is in kilometers
    return null;
  }

  getAllDevices(): Device[] {
    return Array.from(this.deviceMap.values());
  }

  getDeviceCount(): number {
    return this.c;
  }
}
