import Link from 'next/link';

const materials = [
  {
    title: 'All Official Material (Current and Old GRE)',
    columns: [
      {
        heading: 'All Words',
        links: [
          {
            name: 'All TC/SE',
            url: 'https://docs.google.com/spreadsheets/d/114Ec2TLCDsnjYDIIaEWZkJxaexMzB-eikklWUFKU_us/edit?gid=0#gid=0',
          },
          {
            name: 'All Reading',
            url: 'https://docs.google.com/spreadsheets/d/10ZCZ7jlJ4gOFjWNz4bevnUffhMv7K1Cv6ch0_V5zUdw/edit?gid=0#gid=0',
          },
          {
            name: 'All Combined',
            url: 'https://docs.google.com/spreadsheets/d/1hvUYELY0XAfJJ80DAhamrrCQ-mUkOwoal_YZUCtHfyI/edit?gid=0#gid=0',
          },
        ],
      },
      {
        heading: "Greg Mat's List",
        links: [
          {
            name: 'All TC/SE',
            url: 'https://docs.google.com/spreadsheets/d/1Umop91fnw6t_1IkMzVB-7418ezLk-McQMkto_XxApCg/edit?gid=0#gid=0',
          },
          {
            name: 'All Reading',
            url: 'https://docs.google.com/spreadsheets/d/19HnFQCYj4Fzfon4LbBhiEU8FRCrX7JZRepmZZnwGYXU/edit?gid=0#gid=0',
          },
          {
            name: 'All Combined',
            url: 'https://docs.google.com/spreadsheets/d/1hpgt5NMluUtui_GFn_9P8_M1QDaOadbtO-0zIGKYyeg/edit?gid=0#gid=0',
          },
        ],
      },
      {
        heading: "Not Greg Mat's List",
        links: [
          {
            name: 'All TC/SE',
            url: 'https://docs.google.com/spreadsheets/d/1oVG-_ncrksuZpOv-Ldj8Xa6h0FsOnLjlA4VfbfDQpaM/edit?gid=0#gid=0',
          },
          {
            name: 'All Reading',
            url: 'https://docs.google.com/spreadsheets/d/1reHopjiLmFPib2iH6d9Rxu3WHeKj-SbCfGxGAxC0dKg/edit?gid=0#gid=0',
          },
          {
            name: 'All Combined',
            url: 'https://docs.google.com/spreadsheets/d/18fhfldy92l2rtKvgdh7HfvEJNnb3fVHChH8IFRSkJ4U/edit?gid=0#gid=0',
          },
        ],
      },
    ],
  },
  {
    title: 'Official Current Material',
    columns: [
      {
        heading: 'All Words',
        links: [
          {
            name: 'Official TC/SE',
            url: 'https://docs.google.com/spreadsheets/d/1HBdXEJUVneiXBMr56MHj_9Q5yazlBLg0y1qXs40m6Kk/edit?gid=0#gid=0',
          },
          {
            name: 'Official Reading',
            url: 'https://docs.google.com/spreadsheets/d/1m-PtCaX62DwpDj2kAJPFLG1vkJn2xQ7GmQLtjJbe2bk/edit?gid=0#gid=0',
          },
          {
            name: 'Official Combined',
            url: 'https://docs.google.com/spreadsheets/d/1Lwvw72WIogCBNsny5Gm06kOErV3xn69OiI1qGZCXDcY/edit?gid=0#gid=0',
          },
        ],
      },
      {
        heading: "Greg Mat's List",
        links: [
          {
            name: 'Official TC/SE',
            url: 'https://docs.google.com/spreadsheets/d/1wEAhcjj2YKbb42YLQtP2FhEpGwPe4Nv3I2fVanRwPv8/edit?gid=0#gid=0',
          },
          {
            name: 'Official Reading',
            url: 'https://docs.google.com/spreadsheets/d/1xszKkKWrb3DDfNQLlphVy3c4cPcJ9pjwTcXXTVcLhXk/edit?gid=0#gid=0',
          },
          {
            name: 'Official Combined',
            url: 'https://docs.google.com/spreadsheets/d/1wC84nZrCrHBOdtQwrRfld8Imte7YSmB45u8UcQeIP9o/edit?gid=0#gid=0',
          },
        ],
      },
      {
        heading: "Not Greg Mat's List",
        links: [
          {
            name: 'Official TC/SE',
            url: 'https://docs.google.com/spreadsheets/d/1oU8pr9fVpvEhs3I8N9DmESTj5ks2ad3DOqb66OWuMoU/edit?gid=0#gid=0',
          },
          {
            name: 'Official Reading',
            url: 'https://docs.google.com/spreadsheets/d/1LZPNEaxmUHlllkLfEBGIqJft0W7y-GaUrsWsPwQ9FPo/edit?gid=0#gid=0',
          },
          {
            name: 'Official Combined',
            url: 'https://docs.google.com/spreadsheets/d/1vcsxclYGsQQf_42ldVZJbE08_nALNz49efWbprsdb7M/edit?gid=0#gid=0',
          },
        ],
      },
    ],
  },
  {
    title: 'GRE Big Book (Old GRE)',
    columns: [
      {
        heading: 'All Words',
        links: [
          {
            name: 'Big Book Text Completion',
            url: 'https://docs.google.com/spreadsheets/d/1iiaXfy9B67cPlpCqEglT-uDeNK2v5VTwNqUi2uGYIKA/edit?gid=0#gid=0',
          },
          {
            name: 'Big Book Reading',
            url: 'https://docs.google.com/spreadsheets/d/1U3Worx7si3ekLz0fG64fR3-P3gZT3GE7ueDfxeJiPjU/edit?gid=0#gid=0',
          },
          {
            name: 'Big Book Combined',
            url: 'https://docs.google.com/spreadsheets/d/1EHQpLiDdRhbZCHDzb0r0AJa5aPadw_3ivNFS4s_HjNQ/edit?gid=0#gid=0',
          },
        ],
      },
      {
        heading: "Greg Mat's List",
        links: [
          {
            name: 'Big Book Text Completion',
            url: 'https://docs.google.com/spreadsheets/d/1U125ZDCKY2ByiQvyikCvC2oBy3n2k92VXVqn9AwcGOU/edit?gid=0#gid=0',
          },
          {
            name: 'Big Book Reading',
            url: 'https://docs.google.com/spreadsheets/d/1cvH8N2pTKMga0gJzjBdeM8L6Qkyk64O9B6yBqlKY0tw/edit?gid=0#gid=0',
          },
          {
            name: 'Big Book Combined',
            url: 'https://docs.google.com/spreadsheets/d/1uFmLeILJhcWiyTAwPjprK7JI9RMrZe479W1OmnGwYyE/edit?gid=0#gid=0',
          },
        ],
      },
      {
        heading: "Not Greg Mat's List",
        links: [
          {
            name: 'Big Book Text Completion',
            url: 'https://docs.google.com/spreadsheets/d/1PoEePzrrjE5kKxzZtIfHMQ1bNDkyoZgX_W_KeBKHJ-4/edit?gid=0#gid=0',
          },
          {
            name: 'Big Book Reading',
            url: 'https://docs.google.com/spreadsheets/d/1hDp-tH2hjJPxhMfjP96LUF4Ndm81gmIoH4QWDkzgTXc/edit?gid=0#gid=0',
          },
          {
            name: 'Big Book Combined',
            url: 'https://docs.google.com/spreadsheets/d/1lnbwHqqnOoQcVyQ7AcN-KG9YAkTQ-y8MAYN8xyfwwkc/edit?gid=0#gid=0',
          },
        ],
      },
    ],
  },
];

export default function Materials() {
  return (
    <section className="py-6 max-w-6xl mx-auto px-4">
      {materials.map((group, index) => (
        <div key={index} className="mb-1">
          <div className="py-4">
            <h2 className="text-center text-xl md:text-2xl font-semibold">{group.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 pb-6 border-b border-gray-300">
            {group.columns.map((col, idx) => (
              <div key={idx} className="text-center py-6 px-4">
                <h3 className="font-semibold text-base md:text-lg mb-3 ">{col.heading}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      {link.url.startsWith('http') ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500 text-sm md:text-base transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          className="text-blue-400 hover:text-blue-500 text-sm md:text-base transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}{' '}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
