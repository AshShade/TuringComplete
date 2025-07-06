import React, { useState, useEffect } from 'react';
import { Layout, Table, Input, Tag, Select, Typography, Modal, Button, ConfigProvider, theme } from 'antd';
import yaml from 'js-yaml';

const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

function parseYamlInstructions(yamlText) {
  try {
    const doc = yaml.load(yamlText);
    return doc.instructions || [];
  } catch (e) {
    return [];
  }
}

function getTypeColor(type) {
  switch (type) {
    case 'arithmetic':
    case 'logic':
      return 'blue';
    case 'memory':
      return 'gold';
    case 'control':
      return 'red';
    default:
      return 'default';
  }
}

export default function App() {
  const [yamlText, setYamlText] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}instruction_set.yaml`)
      .then(res => res.text())
      .then(setYamlText);
  }, []);

  useEffect(() => {
    setInstructions(parseYamlInstructions(yamlText));
  }, [yamlText]);

  const filtered = instructions.filter(inst => {
    const matchType = typeFilter === 'all' || inst.type === typeFilter || (typeFilter === 'logic' && inst.type === 'arithmetic');
    const matchSearch =
      !search ||
      Object.values(inst)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  function renderOpcodeBin(val) {
    let bin = '';
    if (typeof val === 'string' && val.startsWith('0b')) {
      bin = val.slice(2).padStart(8, '0');
    } else if (typeof val === 'number') {
      bin = val.toString(2).padStart(8, '0');
    } else {
      bin = '00000000';
    }
    // 8 bits, left to right
    return (
      <span style={{ display: 'inline-flex' }}>
        {bin.split('').map((b, i) => {
          let color = '#444';
          if (i < 2) color = '#666'; // first two bits gray
          else if (b === '1') color = '#7be87b'; // soft green
          else if (b === '0') color = '#e57373'; // soft red
          // 增加前4后4分组的间距
          const style = {
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: color,
            border: '1px solid #888',
            marginRight: (i === 3 ? 10 : 2), // 第4个点后加大间距
            verticalAlign: 'middle',
          };
          return (
            <span
              key={i}
              style={style}
              title={`bit${7-i}: ${b}`}
            />
          );
        })}
      </span>
    );
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text, rec) => (
      <span
        onClick={() => setSelected(rec)}
        style={{ color: '#52c41a', cursor: 'pointer', fontWeight: 500 }}
        tabIndex={0}
        role="button"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(rec); }}
      >
        {text}
      </span>
    ) },
    { 
      title: 'Opcode', 
      dataIndex: 'opcode', 
      key: 'opcode',
      render: (val) => {
        if (typeof val === 'string' && val.startsWith('0x')) return val;
        if (typeof val === 'number') return '0x' + val.toString(16).padStart(2, '0').toUpperCase();
        return val;
      }
    },
    { 
      title: 'Opcode Bin', 
      dataIndex: 'opcode_bin', 
      key: 'opcode_bin',
      render: renderOpcodeBin
    },
    { title: 'Type', dataIndex: 'type', key: 'type', render: t => <Tag color={getTypeColor(t)}>{t}</Tag> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#181a1b' }}>
        <Header style={{ padding: 16, background: '#23272e' }}>
          <Title level={3} style={{ margin: 0, color: '#e8eaed', fontWeight: 600 }}>Instruction Set Viewer</Title>
        </Header>
        <Content style={{ margin: 24 }}>
          <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
            <Input.Search
              placeholder="Search by name, opcode, description..."
              allowClear
              onChange={e => setSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 180 }}
            >
              <Option value="all">All Types</Option>
              <Option value="arithmetic">Arithmetic</Option>
              <Option value="logic">Logic</Option>
              <Option value="memory">Memory/Stack</Option>
              <Option value="control">Control</Option>
            </Select>
          </div>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey={rec => rec.name + rec.opcode}
            pagination={false}
            bordered
          />
          <Modal
            open={!!selected}
            title={selected?.name}
            onCancel={() => setSelected(null)}
            footer={<Button onClick={() => setSelected(null)}>Close</Button>}
          >
            {selected && (
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {yaml.dump(selected)}
              </pre>
            )}
          </Modal>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
