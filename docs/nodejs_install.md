To install Node.js 20.x (LTS) on an Amazon Linux EC2 instance, follow these steps:
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-up-node-on-ec2-instance.html

---

### **Steps to Install Node.js 20.x (LTS)**

1. **Connect to Your EC2 Instance**
   Use SSH to connect to your Amazon Linux instance:
   ```bash
   ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>
   ```

2. **Install NodeSource Repository**
   Add the NodeSource repository for Node.js 20.x:
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   ```

   This command adds the Node.js 20.x repository to your package manager and updates the package list.

3. **Install Node.js**
   Install Node.js and npm:
   ```bash
   sudo yum install -y nodejs
   ```

4. **Verify Installation**
   Check the installed version of Node.js and npm to confirm:
   ```bash
   node -v
   npm -v
   ```

   You should see versions for Node.js 20.x and the corresponding npm version.

---

### **Optional: Install Build Tools**
For some npm packages that require compilation, you may need to install build tools:
```bash
sudo yum groupinstall -y "Development Tools"
sudo yum install -y gcc-c++ make
```

---

### **Using Node Version Manager (nvm) (Optional)**
If you prefer more flexibility in managing Node.js versions, you can use `nvm`:

1. **Install nvm**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   source ~/.bashrc
   ```

2. **Install Node.js 20.x (LTS)**:
   ```bash
   nvm install 20
   ```

3. **Set Default Version**:
   ```bash
   nvm use 20
   nvm alias default 20
   ```

4. **Verify**:
   ```bash
   node -v
   npm -v
   ```

---

### **Now You're Ready to Use Node.js 20.x on Your Amazon Linux EC2 Instance!**