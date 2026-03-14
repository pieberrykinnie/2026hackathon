export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export class UserManager {
  userMap: Map<string, User>;
  userEmailToIds: Map<string, Set<string>>;
  userPhoneToIds: Map<string, Set<string>>;
  userCount: number;

  constructor() {
    this.userMap = new Map<string, User>();
    this.userEmailToIds = new Map<string, Set<string>>();
    this.userPhoneToIds = new Map<string, Set<string>>();
    this.userCount = 0;
  }

  addUser(user: User): void {
    if (user.id === "") {
      throw new Error("User must have an id");
    }

    if (this.userMap.get(user.id)) {
      throw new Error("User with id 1 already exists");
    }

    this.userMap.set(user.id, user);

    const phoneRecord: Set<string> | undefined = this.userPhoneToIds.get(user.phone)

    if (phoneRecord) {
      phoneRecord.add(user.id);
    } else {
      this.userPhoneToIds.set(user.phone, new Set([user.id]));
    }

    const emailRecord: Set<string> | undefined = this.userEmailToIds.get(user.email)

    if (emailRecord) {
      emailRecord.add(user.id);
    } else {
      this.userEmailToIds.set(user.email, new Set([user.id]));
    }

    this.userCount++;
  }

  removeUser(id: string): void {
    const result: User | undefined = (this.userMap.get(id));

    if (result) {
      const phoneRecord: Set<string> | undefined = this.userPhoneToIds.get(result.phone);
      if (phoneRecord) { phoneRecord.delete(id); }

      const emailRecord: Set<string> | undefined = this.userEmailToIds.get(result.email);
      if (emailRecord) { emailRecord.delete(id); }

      this.userMap.delete(result.id);
      this.userCount--;
    } else {
      throw new Error(`User with id ${id} not found`)
    }
  }

  getUser(id: string): User | null {
    const result: User | undefined = this.userMap.get(id);
    return result ? result : null;
  }

  getUsersByEmail(email: string): User[] | null {
    let result: User[];
    const emailRecord: Set<string> | undefined = this.userEmailToIds.get(email);

    if (emailRecord) {
      result = Array.from(emailRecord).map(id => this.userMap.get(id)!);
    } else {
      result = [];
    }

    return result;
  }

  getUsersByPhone(phone: string): User[] | null {
    let result: User[];
    const phoneRecord: Set<string> | undefined = this.userPhoneToIds.get(phone);

    if (phoneRecord) {
      result = Array.from(phoneRecord).map(id => this.userMap.get(id)!);
    } else {
      result = [];
    }

    return result;
  }

  getAllUsers(): User[] {
    return Array.from(this.userMap.values());
  }

  getUserCount(): number {
    return this.userCount;
  }
}
