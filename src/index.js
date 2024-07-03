import './styles/index.css';
import * as $ from './utils/dom';
import IconCallOut from './assets/call-out.svg';
import IconCitation from './assets/citation.svg';
import IconDetails from './assets/details.svg';
import IconTextXS from './assets/text-xs.svg';
import IconTextSM from './assets/text-sm.svg';
import IconTextBase from './assets/text-base.svg';
import IconTextLG from './assets/text-lg.svg';
import IconText2XL from './assets/text-2xl.svg';

/**
 * Available predefined variants
 */
export const TextVariant = {
  /**
   * For important information the author wants to emphasize.
   * Should be indicated by a border and some padding inside the border.
   */
  CallOut: 'call-out',

  /**
   * To cite some full-text from a different source without using the Quote tool provided by editor.js.
   * Should be indicated by all italics.
   */
  Citation: 'citation',

  /**
   * To add some information that is less important.
   * Should be indicated by a font about two sizes smaller than standard text.
   */
  Details: 'details',

  TextXS: 'text-xs',
  TextSM: 'text-sm',
  TextBase: 'text-base',
  TextLG: 'text-lg',
  Text2XL: 'text-2xl',
};

/**
 * @typedef {string} TextVariantData
 */

/**
 * @typedef {object} TextVariantTuneConfig
 */

/**
 * This Block Tunes allows user to select some of predefined text variant.
 *
 * @see TextVariant enum for the details.
 * @uses Block Tunes API  {@link https://editorjs.io/block-tunes-api}
 */
export default class TextVariantTune {
  /**
   * Tune constructor. Called on Block creation
   *
   * @param {object} options - constructor params
   * @param {API} api - editor.js Core API
   * @param {BlockAPI} block - editor.js Block API
   * @param {TextVariantData} data - previously saved data
   * @param {TextVariantTuneConfig} config - configuration supported by Tune
   */
  constructor({ api, data, config, block }) {
    this.api = api;
    this.data = data;
    this.config = config;
    this.block = block;

    this.variants = [
      {
        name: TextVariant.CallOut,
        icon: IconCallOut,
        title: this.api.i18n.t('Call Out'),
      },
      {
        name: TextVariant.Citation,
        icon: IconCitation,
        title: this.api.i18n.t('Citation'),
      },
      {
        name: TextVariant.Details,
        icon: IconDetails,
        title: this.api.i18n.t('Details'),
      },
      {
        name: TextVariant.TextXS,
        icon: IconTextXS,
        title: this.api.i18n.t('XS'),
      },
      {
        name: TextVariant.TextSM,
        icon: IconTextSM,
        title: this.api.i18n.t('SM'),
      },
      {
        name: TextVariant.TextBase,
        icon: IconTextBase,
        title: this.api.i18n.t('Base'),
      },
      {
        name: TextVariant.TextLG,
        icon: IconTextLG,
        title: this.api.i18n.t('LG'),
      },
      {
        name: TextVariant.Text2XL,
        icon: IconText2XL,
        title: this.api.i18n.t('2XL'),
      },
    ];

    this.wrapper = undefined;
  }

  /**
   * Tell editor.js that this Tool is a Block Tune
   *
   * @returns {boolean}
   */
  static get isTune() {
    return true;
  }

  /**
   * CSS selectors used in Tune
   */
  static get CSS() {
    return {
      toggler: 'cdx-text-variant__toggler',
    };
  }

  /**
   * Create Tunes controls wrapper that will be appended to the Block Tunes panel
   *
   * @returns {Element}
   */
  render() {
    const tuneWrapper = $.make('div', '');

    this.variants.forEach(({ name, icon, title }) => {
      const toggler = $.make('div', [this.api.styles.settingsButton, TextVariantTune.CSS.toggler], {
        innerHTML: icon,
      });

      toggler.dataset.name = name;

      this.api.tooltip.onHover(toggler, title, {
        placement: 'top',
        hidingDelay: 500,
      });

      if (this.data === name) {
        toggler.classList.add(this.api.styles.settingsButtonActive);
      } else {
        toggler.classList.remove(this.api.styles.settingsButtonActive);
      }

      tuneWrapper.appendChild(toggler);
    });

    /**
     * Delegate click event on all the controls
     */
    this.api.listeners.on(tuneWrapper, 'click', (event) => {
      this.tuneClicked(event);
    });

    return tuneWrapper;
  }

  /**
   * Handler for Tune controls click
   * Toggles the variant
   *
   * @param {MouseEvent} event - click
   * @returns {void}
   */
  tuneClicked(event) {
    const tune = event.target.closest(`.${this.api.styles.settingsButton}`);
    const isEnabled = tune.classList.contains(this.api.styles.settingsButtonActive);

    tune.classList.toggle(this.api.styles.settingsButtonActive, !isEnabled);

    if (!isEnabled) {
      this.variant(tune.dataset.name);
    } else {
      this.variant('');
    }
  
    this.block.dispatchChange();
  }

  /**
   * Wraps Block Content to the Tunes wrapper
   *
   * @param {Element} blockContent - editor.js block inner container
   * @returns {Element} - created wrapper
   */
  wrap(blockContent) {
    this.wrapper = $.make('div');

    this.variant(this.data);

    this.wrapper.appendChild(blockContent);

    return this.wrapper;
  }

  /**
   * Save current variant in memory and apply style for that
   *
   * @param {string} name - variant to save
   */
  variant(name) {
    this.data = name;

    this.variants.forEach((variant) => {
      this.wrapper.classList.toggle(`cdx-text-variant--${variant.name}`, variant.name === this.data);

      let toggler = document.querySelector(`.${TextVariantTune.CSS.toggler}[data-name="${variant.name}"]`);
      if (toggler) {
        toggler.classList.toggle(this.api.styles.settingsButtonActive, variant.name === this.data);
      }
    });
  }

  /**
   * Returns Tune state
   *
   * @returns {string}
   */
  save() {
    return this.data || '';
  }
}
