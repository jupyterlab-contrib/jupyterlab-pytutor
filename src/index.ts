import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { LabIcon } from '@jupyterlab/ui-components';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { ToolbarButton } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

// import { KernelMessage, ServiceManager } from '@jupyterlab/services';
//import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { IFrame } from '@jupyterlab/apputils';
// import { PageConfig } from '@jupyterlab/coreutils';

import {
  // NotebookActions,
  NotebookPanel,
  INotebookModel
} from '@jupyterlab/notebook';

import iconSvgStr from '../style/icon.svg';

export const teachIcon = new LabIcon({
  name: 'jupyterlab-pytutor:icon',
  svgstr: iconSvgStr
});

import { Message } from '@lumino/messaging';

import { StackedPanel } from '@lumino/widgets';

/**
 * Initialization data for the jupyterlab-pytutor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-pytutor:plugin',
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry) => {
    let _settings: ISettingRegistry.ISettings;
    let pyTutorExtension: PyTutorExtension | undefined = undefined;
    const { shell } = app;

    const _loadSettings = () => {
      if (pyTutorExtension) {
        pyTutorExtension.settings = _settings;
      }
      pyTutorExtension = new PyTutorExtension(shell, _settings);
      app.docRegistry.addWidgetExtension('Notebook', pyTutorExtension);
    };

    settingRegistry.load(plugin.id).then(settings => {
      console.log(settings);
      _settings = settings;
      _loadSettings();
      settings.changed.connect(_loadSettings);
    });
  }
};

export class PyTutorExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  constructor(
    shell: JupyterFrontEnd.IShell,
    settings: ISettingRegistry.ISettings
  ) {
    this._shell = shell;
    this.settings = settings;
  }
  /**
   * Create a new extension for the notebook panel widget.
   *
   * @param panel Notebook panel
   * @param context Notebook context
   * @returns Disposable on the added button
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable | undefined {
    const runPytutor = () => {
      const add_cell_separators = this.settings.get('add_cell_separators')
        .composite as boolean;

      // collect sourcecode of all selected code cells
      let src = '';

      const nCodeCells = panel.content.widgets.filter(
        cell =>
          panel.content.isSelectedOrActive(cell) && cell.model.type === 'code'
      ).length;
      console.log('nCodeCells', nCodeCells);

      let codeCellIndex = 0;
      panel.content.widgets.forEach((cell, cell_index) => {
        if (
          panel.content.isSelectedOrActive(cell) &&
          cell.model.type === 'code'
        ) {
          if (add_cell_separators && nCodeCells >= 2) {
            src += '###############################\n';
            src += `# Cell ${codeCellIndex}\n`;
            src += '###############################\n';
          }
          console.log('code cell', cell_index);
          src += `${cell.model.sharedModel.source}\n`;
          if (add_cell_separators && codeCellIndex + 1 < nCodeCells) {
            src += '\n';
          }
          ++codeCellIndex;
        }
      });

      if (this._pytutorPanel === undefined || this._pytutorPanel.isDisposed) {
        this._pytutorPanel = new PyTutorPanel(src);
        this._shell.add(this._pytutorPanel, 'main', { mode: 'split-right' });
      } else {
        this._pytutorPanel.changeSourceCode(src);
      }
    };

    console.log('panel.content.defaultKernelLanguage');
    //if(model && model.defaultKernelLanguage == 'python') # this does not work :/
    {
      const button = new ToolbarButton({
        className: 'pytutor-button',
        label: 'pytutor',
        onClick: runPytutor,
        tooltip: 'Run PyTutor'
      });

      panel.toolbar.insertItem(10, 'PyTutor', button);
      return new DisposableDelegate(() => {
        button.dispose();
      });
    }
  }

  settings: ISettingRegistry.ISettings;
  private _shell: JupyterFrontEnd.IShell;
  private _pytutorPanel: PyTutorPanel | undefined;
}

class PyTutorPanel extends StackedPanel {
  constructor(src: string) {
    super();
    this.addClass('jp-RovaPanel');
    this.id = 'pytutor-output-panel';
    this.title.label = 'PyTutor';
    this.title.icon = teachIcon;
    this.title.closable = true;
    this._pytutorPanel = new PyTutorIFrame(src);
    this.addWidget(this._pytutorPanel);
  }
  changeSourceCode(src: string): void {
    // chaging the url and reloading the iframe does not work
    // therefore we add a fresh Iframe
    this._pytutorPanel.dispose();
    this._pytutorPanel = new PyTutorIFrame(src);
    this.addWidget(this._pytutorPanel);
  }

  dispose(): void {
    this._pytutorPanel.dispose();
    super.dispose();
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg);
    this.dispose();
  }
  private _pytutorPanel: PyTutorIFrame;
}

class PyTutorIFrame extends IFrame {
  constructor(src: string) {
    super();

    console.log('SRC: ', src);
    this.url = `https://pythontutor.com/iframe-embed.html#code=${encodeURIComponent(
      src
    )}&codeDivHeight=900&codeDivWidth=350&cumulative=true&curInstr=0&heapPrimitives=nevernest&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false`;
    console.log('Full URL: ', this.url);

    this.id = 'PyTutor';
    // this.title.label = label;
    // this.title.icon = camIcon;
    this.title.closable = false;
    this.node.style.overflowY = 'auto';
    this.node.style.background = '#FFF';
    this.sandbox = [
      'allow-forms',
      'allow-modals',
      'allow-orientation-lock',
      'allow-pointer-lock',
      'allow-popups',
      'allow-presentation',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation',
      'allow-top-navigation-by-user-activation'
    ];
  }
}

export default plugin;
