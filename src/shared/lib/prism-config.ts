import Prism from 'prismjs';

// Core/common syntaxes
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup'; // 'markup' = HTML/XML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

// Extra you listed
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';

Prism.manual = true;

export { Prism };
