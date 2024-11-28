// /api/eligibility.js

export default async function handler(req, res) {
  const { address } = req.query; // Get the address from query params

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  // Example eligibility data - replace with real data
  const users = {
    '0x00000012Ec7f8928bd4deb14dA43D53184aD6a51': { eligible: true, value: 100, proof: ['0xabcdef', '0x123456'] },
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': { eligible: false, value: 0, proof: [] }
  };

  //const user = users[address.toLowerCase()];
  const user = users[address];

  if (user) {
    return res.status(200).json(user); // Return user eligibility data
  } else {
    return res.status(404).json({ eligible: false, value: 0, proof: [] });
  }
}
